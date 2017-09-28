import { Pipe, PipeTransform } from '@angular/core';
import {proxy} from "../types/utils";

@Pipe({name: 'proxy'})
export class ProxyPipe implements PipeTransform {
  transform(value: string): string {
    return value ? proxy(value) : value;
  }
}
