import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";
import { Observable } from "rxjs/Rx";
import { DenunciaDto } from "../../models/denuncia.dto";
import { PostagemDTO } from "../../models/postagem.dto";

@Injectable()
export class ComentarioService{

    constructor(public http: HttpClient, public storage: StorageService) {
    }


}