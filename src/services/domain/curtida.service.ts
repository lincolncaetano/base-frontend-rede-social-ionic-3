import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs/Rx";
import { CurtidaDTO } from "../../models/curtida.dto";

@Injectable()
export class CurtidaService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    insert(obj : CurtidaDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/curtidas`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    delete(idUsuario, idPostagem) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/curtidas/${idUsuario}/${idPostagem}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    findByPostagemId(id: string) : Observable<CurtidaDTO[]> {
        return this.http.get<CurtidaDTO[]>(`${API_CONFIG.baseUrl}/curtidas/findByIdPostagem/${id}`);
    }

}