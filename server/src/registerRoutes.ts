import express, { Router, Request, Response, NextFunction } from 'express';
import { ParamType } from './common/decorators/params/types';
import { CONTROLLER_KEY } from './common/decorators/controller.decoder';
import { ROUTE_KEY } from './common/decorators/route.decoder';

type ControllerConstructor = new (...args: any[]) => any;

interface RouteDefinition {
  method: string;
  path: string;
  handlerName: string;
  middleware?: any[];
}

interface ParamMetadata {
  index: number;
  type: ParamType;
  key?: string;
}

export function registerRoutes(app: express.Application, controllers: ControllerConstructor[]) {
  controllers.forEach(ControllerClass => {
     // Get controller metadata
    const basePath = Reflect.getMetadata(CONTROLLER_KEY, ControllerClass);
    if (!basePath) {
      throw new Error(`No controller path found for ${ControllerClass.name}`);
    }

    const controllerInstance = new ControllerClass();
    const router = Router();
 // Get all route definitions
    const routes: RouteDefinition[] = Reflect.getMetadata(ROUTE_KEY, ControllerClass) || [];
// Register each route
    routes.forEach(route => {
      const { method, path, handlerName, middleware = [] } = route;

      //after parameter decorator <
      // Get parameter metadata for this handler
      const paramMetadata: ParamMetadata[] = Reflect.getOwnMetadata(
        "custom:params", 
        controllerInstance, 
        handlerName
      ) || [];

      // Create the enhanced handler
      const enhancedHandler = (req: Request, res: Response, next: NextFunction) => {
        try {
          // Prepare arguments based on parameter decorators
          const args = paramMetadata
            .sort((a, b) => a.index - b.index)
            .map(({ type, key }) => {
              switch (type) {
                case ParamType.REQUEST:
                  return req;
                case ParamType.RESPONSE: // Note: Typo in your code (REAPONSE vs RESPONSE)
                  return res;
                case ParamType.BODY:
                  return key ? req.body[key] : req.body;
                case ParamType.PARAM:
                  return key ? req.params[key] : req.params;
                case ParamType.QUERY:
                  return key ? req.query[key] : req.query;
                case ParamType.HEADER:
                  return key ? req.headers[key.toLowerCase()] : req.headers;
                default:
                  return undefined;
              }
            });

          // Call the original handler with properly ordered arguments
          const result = controllerInstance[handlerName].apply(controllerInstance, args);
          
          // Handle async/Promise results
          if (result instanceof Promise) {
            return result.catch(next);
          }
          
          return result;
        } catch (error) {
          next(error);
        }
      };
      //parameter decorator >


      // Register with Express router
      if (typeof (router as any)[method.toLowerCase()] !== 'function') {
        throw new Error(`Invalid HTTP method: ${method}`);
      }

      (router as any)[method.toLowerCase()](path, ...middleware, enhancedHandler);
    });

    app.use(basePath, router);
  });
}