import { InjectionToken, Type } from '@angular/core';
import * as WebstompClient from 'webstomp-client';
export const WEBSOCKET = new InjectionToken<Type<WebSocket>>('Websocket', { providedIn: 'root', factory: () => WebSocket });
export const WEBSTOMP = new InjectionToken<typeof WebstompClient>('WebstompClient', { providedIn: 'root', factory: () => WebstompClient });
