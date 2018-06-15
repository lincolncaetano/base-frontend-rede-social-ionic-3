import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { DenunciaDto } from "../../models/denuncia.dto";

@Injectable()
export class DenunciaService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    insert(obj : DenunciaDto) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/denuncia`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

}