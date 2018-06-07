import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PostagemDTO } from "../../models/postagem.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CategoriaService{

    constructor(public http: HttpClient){
    }

    findAll() : Observable<PostagemDTO[]>{
        return this.http.get<PostagemDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
    }
}