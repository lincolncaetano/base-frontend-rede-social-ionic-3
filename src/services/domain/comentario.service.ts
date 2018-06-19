import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs/Rx";
import { ComentarioDTO } from "../../models/comentario.dto";

@Injectable()
export class ComentarioService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    insert(obj : ComentarioDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/comentarios`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    delete(idComentario) {
        return this.http.delete(
            `${API_CONFIG.baseUrl}/comentarios/${idComentario}`, 
            {
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    findByPostagemId(id: string) : Observable<ComentarioDTO[]> {
        return this.http.get<ComentarioDTO[]>(`${API_CONFIG.baseUrl}/comentarios/findByIdPostagem?value=${id}`);
    }

}