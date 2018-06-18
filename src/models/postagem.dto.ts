import { UsuarioDTO } from "./usuario.dto";
import { CurtidaDTO } from "./curtida.dto";

export interface PostagemDTO {
    id : string;
    usuario: UsuarioDTO;
    opcao1?: string;
    opcao2?: string;
    pergunta?: string;
    status?: string;
    listaCurtidas? : string[];
}