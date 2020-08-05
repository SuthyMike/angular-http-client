import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // can add an if here to check if the URL must be authenticated and only add auth header then
    const modifiedRequest = req.clone({ headers: req.headers.append('Auth', 'dvbui3g0924nicewfni2ea') });
    return next.handle(modifiedRequest);
  }
}
