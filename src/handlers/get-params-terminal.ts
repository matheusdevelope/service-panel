import { resolve } from "path";
import { EnumKeysDispatchPanel } from "../types/params";
interface IAcceptParams {
  param: string;
  required: boolean;
}
const input = process.argv.splice(2);
const AcceptParams: IAcceptParams[] = [];
const ParamsInput: {
  [key: string]: string;
} = {};
const Errors: {
  message: string;
  parametro: string;
}[] = [];
function log(
  params: string | number | boolean,
  p2?: string | number | boolean
) {
  console.log(params, p2 || "");
}
function AddError(message: string, parametro: string) {
  Errors.push({
    message,
    parametro,
  });
}

function ParamAccepted(param: string) {
  for (let i = 0; i < AcceptParams.length; i++) {
    if (AcceptParams[i].param.toLowerCase() === param.toLowerCase())
      return true;
  }
  return false;
}
function Help() {
  log("AJUDA>>>\n\n");
  log("Parametros aceitos >\n");
  AcceptParams.forEach((obj) => {
    log(obj.param);
    log("Obrigatório: ", obj.required.toString());
    log("-----------------------------");
  });
  log("\n");
}
function getParamsTerminal() {
  for (const key in EnumKeysDispatchPanel) {
    AcceptParams.push({
      param: `--${key}`,
      required: true,
    });
  }

  if (input.toString().toLowerCase().includes("--help") || input.length === 0) {
    Help();
    return false;
  }

  input.forEach((text, i) => {
    if (text.includes("--")) {
      if (ParamAccepted(text)) {
        if (input[i + 1]) {
          ParamsInput[text.replace("--", "").toLowerCase()] = input[i + 1];
        } else {
          AddError("Informe um valor para o parametro informado", text);
        }
      } else {
        AddError("O parametro informado não é aceito.", text);
      }
    }
  });

  let Params: {
    [key: string]: string;
  } = {};
  AcceptParams.forEach((obj, i) => {
    const NameParam = obj.param.replace("--", "");
    if (AcceptParams[i].required && !ParamsInput[NameParam])
      AddError(
        "Um parametro obrigatório não foi informado! ",
        AcceptParams[i].param
      );
    Params[NameParam] = ParamsInput[NameParam];
  });

  if (Errors.length > 0) {
    log("\nAlgo deu errado!\n");
    log("Parametros recebidos: ", input.toString().replace(/(,)/g, " "));
    log("\n");
    log("Parametros aceitos:");
    AcceptParams.forEach((obj) => log(obj.param));
    log("\n");
    Errors.forEach((obj) => {
      log("----------------------------------");
      log("Mensagem: ", obj.message);
      log("Parametro: ", obj.parametro);
    });
    log("\n");
    return false;
  }

  return Params;
}

export default getParamsTerminal;
