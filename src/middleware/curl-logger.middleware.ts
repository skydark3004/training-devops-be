import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CurlLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Bắt đầu với lệnh curl và URL
    let curlCommand = `curl -X ${req.method} "${req.protocol}://${req.get('host')}${req.originalUrl}"`;

    // Thêm headers vào lệnh curl
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        curlCommand += ` -H "${key}: ${value}"`;
      }
    });

    // Thêm data nếu có (cho POST, PUT, PATCH)
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      const data = JSON.stringify(req.body);
      curlCommand += ` -d '${data}'`;
    }

    // Log lệnh curl ra console
    console.log(curlCommand);

    // Tiếp tục xử lý request
    next();
  }
}
