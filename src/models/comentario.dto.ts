import { UsuarioDTO } from "./usuario.dto";
import { PostagemDTO } from "./postagem.dto";

export interface ComentarioDTO {
    id?: string;
    usuario : UsuarioDTO;
    postagem : {id : string};
    texto: string;
    date?: any;
}