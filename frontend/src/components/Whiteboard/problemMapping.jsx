import VectorCompAng1_1 from "../3DComponentes/Unit1/VectorCompAng1_1";
import EqLine1_4_3 from "../3DComponentes/Unit1/EqLine1_4_3";
import VectorSum1_2 from "../3DComponentes/Unit1/VectorSum1_2";
import VectorDot1_3 from "../3DComponentes/Unit1/VectorDot1_3";
import EqLine1_4_1 from "../3DComponentes/Unit1/EqLine1_4_1";
import EqLine1_4_2 from "../3DComponentes/Unit1/EqLine1_4_2";
import VectorCross1_5 from "../3DComponentes/Unit1/VectorCross1_5";
import EqPlane1_6_1 from "../3DComponentes/Unit1/EqPlane1_6_1";
import EqPlane1_6_2 from "../3DComponentes/Unit1/EqPlane1_6_2";
import EqPlane1_6_3 from "../3DComponentes/Unit1/EqPlane1_6_3";

import Form1_1 from "../customForms/Unit1/Form1_1";

export const mappingUnit1 = {
    "1.1 Componentes de un Vector": {
        customFunction: VectorCompAng1_1,
        customForm: Form1_1,
    },
    "1.2 Suma de Vectores": {
        customFunction: VectorSum1_2,
        // customForm: form1_1,
    },
    "1.3 Producto Punto": {
        customFunction: VectorDot1_3,
        // customForm: form1_1,
    },
    "1.4.1 Ecuacion de la Recta": {
        customFunction: EqLine1_4_1,
        // customForm: form1_1,
    },
    "1.4.2 Ecuacion de la Recta": {
        customFunction: EqLine1_4_2,
        // customForm: form1_1,
    },
    "1.4.3 Ecuacion de la Recta": {
        customFunction: EqLine1_4_3,
        // customForm: form1_1,
    },
    "1.5 Producto Cruz": {
        customFunction: VectorCross1_5,
        // customForm: form1_1,
    },
    "1.6.1 Ecuacion del Plano": {
        customFunction: EqPlane1_6_1,
        // customForm: form1_1,
    },
    "1.6.2 Ecuacion del Plano": {
        customFunction: EqPlane1_6_2,
        // customForm: form1_1,
    },
    "1.6.3 Ecuacion del Plano": {
        customFunction: EqPlane1_6_3,
        // customForm: form1_1,
    },
};
