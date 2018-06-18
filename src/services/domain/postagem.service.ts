import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs/Rx";
import { DenunciaDto } from "../../models/denuncia.dto";
import { PostagemDTO } from "../../models/postagem.dto";

@Injectable()
export class PostagemService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }

    insert(obj : PostagemDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/postagens`, 
            obj,
            { 
                observe: 'response', 
                responseType: 'text'
            }
        ); 
    }

    findByUsuarioId(id: string) : Observable<PostagemDTO[]> {
        return this.http.get<PostagemDTO[]>(`${API_CONFIG.baseUrl}/postagens/findByIdUsuario/${id}`);
    }

}