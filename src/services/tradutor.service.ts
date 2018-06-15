import { Injectable, Injector } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class TradutorService{

    constructor(private injector: Injector){
    }

    retornaMsg(msg){

        let translate = this.injector.get(TranslateService);
        let retorno;
        translate.get(msg).subscribe(
            value => {
            retorno =  value;
            }
        )
        return retorno;
    }
}