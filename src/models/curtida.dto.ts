import { UsuarioDTO } from "./usuario.dto";
import { PostagemDTO } from "./postagem.dto";

export interface CurtidaDTO {
    id:{
        usuario : UsuarioDTO;
        postagem : PostagemDTO;
    }
}