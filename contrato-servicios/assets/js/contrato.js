/* =====================================================================
   CONTENIDO DEL CONTRATO
   ---------------------------------------------------------------------
   Fuente única del documento. La página lo convierte en texto editable,
   y desde ese mismo contenido se generan el Word (.docx) y el PDF.

   Sintaxis:
   · [[Etiqueta]]  → campo editable; si se deja vacío se exporta como [●].
   · **texto**     → negrita.
   Tipos de bloque: h2 (cláusula), h3 (subcláusula), p (párrafo),
   ul (viñetas), table (tabla editable), sign (bloque de firmas),
   note (nota final), pagebreak (salto de página).
   ===================================================================== */

window.CONTRATO = {
  title: 'ACUERDO / CONTRATO DE PRESTACIÓN DE SERVICIOS',
  subtitle: 'Modelo de prestación de servicios entre personas naturales y empresa en Colombia',
  headerText: 'Contrato de prestación de servicios — Personas naturales y empresa (Colombia)',
  fileBase: 'Contrato_Prestacion_Servicios_B2B_Colombia',

  blocks: [

    { t: 'p', cls: 'intro', text: 'Entre los suscritos, quienes se identifican más adelante, se ha celebrado el presente contrato de prestación de servicios, que se regirá por las cláusulas que a continuación se expresan y, en lo no previsto en ellas, por las normas civiles y comerciales de la República de Colombia.' },

    /* ---------------------------------------------------------- 1 */
    { t: 'h2', text: '1. PARTES' },
    { t: 'p', text: 'Son partes del presente contrato:' },

    { t: 'h3', text: '1.1. El Contratante' },
    { t: 'table', cls: 'datos', rows: [
      ['Razón social', '[[Razón social de la empresa]]'],
      ['NIT', '[[NIT]]'],
      ['Representante legal', '[[Nombre completo del representante legal]]'],
      ['Documento de identidad del representante legal', '[[Tipo y número de documento]]'],
      ['Dirección', '[[Dirección y ciudad]]'],
      ['Correo electrónico', '[[Correo electrónico]]'],
      ['Teléfono', '[[Teléfono]]']
    ]},
    { t: 'p', text: 'En adelante, **el CONTRATANTE**.' },

    { t: 'h3', text: '1.2. Contratista 1' },
    { t: 'table', cls: 'datos', rows: [
      ['Nombre completo', '[[Nombre completo]]'],
      ['Cédula de ciudadanía / documento', '[[Número de cédula]]'],
      ['Dirección', '[[Dirección y ciudad]]'],
      ['Correo electrónico', '[[Correo electrónico]]'],
      ['Teléfono', '[[Teléfono]]']
    ]},

    { t: 'h3', text: '1.3. Contratista 2' },
    { t: 'table', cls: 'datos', rows: [
      ['Nombre completo', '[[Nombre completo]]'],
      ['Cédula de ciudadanía / documento', '[[Número de cédula]]'],
      ['Dirección', '[[Dirección y ciudad]]'],
      ['Correo electrónico', '[[Correo electrónico]]'],
      ['Teléfono', '[[Teléfono]]']
    ]},
    { t: 'p', text: 'El Contratista 1 y el Contratista 2 actúan en nombre propio, como personas naturales, y en adelante se denominarán conjuntamente **los CONTRATISTAS** e individualmente **el CONTRATISTA**. El CONTRATANTE y los CONTRATISTAS se denominarán conjuntamente **las PARTES**.' },

    { t: 'h3', text: '1.4. Actuación conjunta de los Contratistas' },
    { t: 'p', text: 'Los CONTRATISTAS declaran que prestarán los servicios de manera coordinada, sin que ello implique la constitución de una sociedad, consorcio o persona jurídica entre ellos. Para efectos de comunicaciones, coordinación y entregas, los CONTRATISTAS designan como vocero a [[Nombre del Contratista vocero]], sin perjuicio de que cualquiera de ellos pueda atender directamente los requerimientos del CONTRATANTE.' },
    { t: 'p', text: 'Frente al CONTRATANTE, la responsabilidad de los CONTRATISTAS por la ejecución del contrato será [[solidaria / individual, según la distribución de actividades del Anexo Técnico]]. La distribución interna de actividades y de la remuneración entre los CONTRATISTAS se detalla en el Anexo Comercial.' },

    /* ---------------------------------------------------------- 2 */
    { t: 'h2', text: '2. ANTECEDENTES' },
    { t: 'p', text: '2.1. El CONTRATANTE es una sociedad constituida conforme a las leyes colombianas, que requiere la prestación de servicios de [[Naturaleza general del servicio, p. ej. desarrollo de software / consultoría / automatización]] para el desarrollo de su actividad.' },
    { t: 'p', text: '2.2. Los CONTRATISTAS son personas naturales que cuentan con la experiencia, los conocimientos y la capacidad técnica y operativa necesarios para prestar dichos servicios de manera independiente, con sus propios medios y bajo su propia dirección y organización.' },
    { t: 'p', text: '2.3. Las PARTES han convenido celebrar el presente contrato con el fin de regular de forma clara y equilibrada los servicios que se prestarán, los entregables, la remuneración, los derechos sobre los resultados y las demás condiciones de su relación, la cual es de naturaleza civil y comercial.' },

    /* ---------------------------------------------------------- 3 */
    { t: 'h2', text: '3. OBJETO DEL CONTRATO' },
    { t: 'p', text: '3.1. En virtud del presente contrato, los CONTRATISTAS se obligan a prestar al CONTRATANTE, con plena autonomía técnica, administrativa y directiva, los siguientes servicios:' },
    { t: 'p', cls: 'campo-largo', text: '[[DESCRIPCIÓN DEL SERVICIO]]' },
    { t: 'p', text: '3.2. Los servicios se prestarán de acuerdo con las especificaciones, el alcance, los entregables y el cronograma definidos en la cláusula 4 y en los anexos de este contrato, los cuales hacen parte integral del mismo.' },

    /* ---------------------------------------------------------- 4 */
    { t: 'h2', text: '4. ALCANCE Y ENTREGABLES' },
    { t: 'h3', text: '4.1. Servicios incluidos' },
    { t: 'p', text: 'Están incluidos dentro del alcance del contrato los siguientes servicios y actividades:' },
    { t: 'p', cls: 'campo-largo', text: '[[Servicios y actividades incluidos]]' },

    { t: 'h3', text: '4.2. Entregables' },
    { t: 'p', text: 'Los CONTRATISTAS entregarán al CONTRATANTE los siguientes entregables, con las características y en las fechas que se indican:' },
    { t: 'table', cls: 'entregables', head: ['N.º', 'Entregable', 'Características / descripción', 'Fecha de entrega', 'Criterio de aceptación'], rows: [
      ['1', '[[Entregable]]', '[[Características]]', '[[Fecha]]', '[[Criterio de aceptación]]'],
      ['2', '[[Entregable]]', '[[Características]]', '[[Fecha]]', '[[Criterio de aceptación]]'],
      ['3', '[[Entregable]]', '[[Características]]', '[[Fecha]]', '[[Criterio de aceptación]]']
    ]},
    { t: 'p', text: 'El detalle técnico de cada entregable, sus criterios de aceptación y el cronograma completo constan en el Anexo Técnico y en el Cronograma, que prevalecen sobre esta tabla en caso de mayor detalle y que podrán ajustarse conforme a la cláusula 9.' },

    { t: 'h3', text: '4.3. Exclusiones' },
    { t: 'p', text: 'No están incluidos en el alcance del contrato, y por tanto no forman parte del valor pactado, los siguientes servicios, actividades o productos:' },
    { t: 'p', cls: 'campo-largo', text: '[[Servicios, actividades o productos excluidos, p. ej. soporte posterior, licencias de terceros, infraestructura, capacitación]]' },
    { t: 'p', text: 'Cualquier servicio, actividad o requerimiento no previsto expresamente en esta cláusula o en los anexos se entenderá excluido y solo podrá incorporarse mediante el procedimiento de cambios de alcance previsto en la cláusula 9.' },

    /* ---------------------------------------------------------- 5 */
    { t: 'h2', text: '5. OBLIGACIONES DE LOS CONTRATISTAS' },
    { t: 'p', text: 'Sin perjuicio de las demás obligaciones previstas en este contrato y en sus anexos, los CONTRATISTAS se obligan a:' },
    { t: 'ul', items: [
      'Ejecutar los servicios objeto del contrato con diligencia, calidad profesional y conforme a las buenas prácticas de su disciplina.',
      'Cumplir los entregables acordados, con las características y criterios de aceptación definidos en la cláusula 4 y en el Anexo Técnico.',
      'Cumplir el cronograma pactado, salvo en los eventos de suspensión, fuerza mayor, caso fortuito o cambios de alcance regulados en este contrato.',
      'Informar por escrito y de manera oportuna al CONTRATANTE sobre cualquier riesgo, dificultad, dependencia o retraso previsible que pueda afectar la ejecución de los servicios, proponiendo alternativas cuando sea posible.',
      'Guardar la confidencialidad de la información del CONTRATANTE en los términos de la cláusula 13.',
      'Cumplir, cada uno por su cuenta, las obligaciones legales, tributarias y de seguridad social que les correspondan como trabajadores independientes, incluyendo la afiliación y el pago de aportes al Sistema de Seguridad Social Integral sobre la base y en la forma previstas en la normativa vigente, y acreditar dicho cumplimiento cuando el CONTRATANTE lo requiera para efectos del pago.',
      'Expedir la factura electrónica o el documento equivalente que corresponda según su condición tributaria o, cuando no estén obligados a facturar, suministrar la información necesaria para que el CONTRATANTE genere el documento soporte correspondiente.',
      'Utilizar la información, los accesos y los recursos suministrados por el CONTRATANTE únicamente para la ejecución del contrato y devolverlos o eliminarlos a su terminación, según se instruya.',
      'Atender las observaciones formuladas por el CONTRATANTE sobre los entregables dentro del alcance contratado, conforme a la cláusula 8.',
      'Abstenerse de ceder o subcontratar total o parcialmente la ejecución del contrato sin autorización previa y escrita del CONTRATANTE, salvo en cuanto a colaboradores o herramientas de apoyo que no impliquen la cesión de responsabilidad.',
      'Cumplir las demás obligaciones que se deriven de la naturaleza del contrato, de la ley y de los anexos.'
    ]},

    /* ---------------------------------------------------------- 6 */
    { t: 'h2', text: '6. OBLIGACIONES DEL CONTRATANTE' },
    { t: 'p', text: 'Sin perjuicio de las demás obligaciones previstas en este contrato y en sus anexos, el CONTRATANTE se obliga a:' },
    { t: 'ul', items: [
      'Entregar a los CONTRATISTAS, de manera completa, veraz y oportuna, la información, documentación y definiciones necesarias para la prestación de los servicios.',
      'Proporcionar los accesos, credenciales, licencias, ambientes, equipos y demás recursos acordados en el Anexo Técnico dentro de los plazos allí previstos.',
      'Designar por escrito a la persona o personas responsables de coordinar la ejecución del contrato, atender consultas, revisar entregables y otorgar aprobaciones en su nombre.',
      'Revisar, aprobar u objetar los entregables de forma motivada y dentro de los plazos previstos en la cláusula 8.',
      'Pagar a los CONTRATISTAS el valor pactado, en la forma, moneda y oportunidad previstas en la cláusula 7.',
      'Abstenerse de impartir órdenes sobre la forma, horario o lugar de ejecución de los servicios, respetando la autonomía técnica y administrativa de los CONTRATISTAS, sin perjuicio de la coordinación necesaria para el cumplimiento del objeto contractual.',
      'Efectuar las retenciones y cumplir los deberes tributarios que la ley le imponga en su condición de contratante y expedir los certificados correspondientes.',
      'Guardar la confidencialidad de la información de los CONTRATISTAS en los términos de la cláusula 13.',
      'Cumplir las demás obligaciones que se deriven de la naturaleza del contrato, de la ley y de los anexos.'
    ]},

    /* ---------------------------------------------------------- 7 */
    { t: 'h2', text: '7. VALOR, FACTURACIÓN Y FORMA DE PAGO' },
    { t: 'h3', text: '7.1. Valor del contrato' },
    { t: 'p', text: 'El valor total del presente contrato es de [[Valor total en números y letras]] ([[Moneda, p. ej. pesos colombianos – COP]]), suma que [[incluye / no incluye]] el impuesto sobre las ventas (IVA) cuando este resulte aplicable según la condición tributaria de cada CONTRATISTA.' },
    { t: 'h3', text: '7.2. Forma de pago' },
    { t: 'p', text: 'El CONTRATANTE pagará el valor del contrato de la siguiente manera:' },
    { t: 'table', cls: 'pagos', head: ['Hito / concepto', 'Porcentaje o valor', 'Condición para el pago', 'Fecha estimada'], rows: [
      ['Anticipo', '[[% o valor]]', 'A la firma del contrato', '[[Fecha]]'],
      ['[[Hito 1]]', '[[% o valor]]', 'Aceptación del entregable [[N.º]]', '[[Fecha]]'],
      ['[[Hito 2]]', '[[% o valor]]', 'Aceptación del entregable [[N.º]]', '[[Fecha]]'],
      ['Pago final', '[[% o valor]]', 'Aceptación final de los entregables', '[[Fecha]]']
    ]},
    { t: 'p', text: 'Cada pago se efectuará dentro de los [[Número]] ([[número en letras]]) días calendario siguientes a la presentación de la factura o del documento soporte, junto con la constancia de pago de aportes a seguridad social de cada CONTRATISTA cuando la ley lo exija, siempre que se haya cumplido la condición prevista para el respectivo pago.' },
    { t: 'h3', text: '7.3. Distribución entre los Contratistas' },
    { t: 'p', text: 'El valor del contrato se distribuirá entre los CONTRATISTAS conforme al Anexo Comercial. Cada CONTRATISTA facturará o soportará individualmente la parte que le corresponda y el CONTRATANTE pagará a cada uno de ellos en la cuenta o mecanismo indicado a continuación:' },
    { t: 'table', cls: 'datos', rows: [
      ['Contratista 1 — cuenta o mecanismo de pago', '[[Banco, tipo y número de cuenta o mecanismo]]'],
      ['Contratista 2 — cuenta o mecanismo de pago', '[[Banco, tipo y número de cuenta o mecanismo]]']
    ]},
    { t: 'h3', text: '7.4. Impuestos y retenciones' },
    { t: 'p', text: 'Cada PARTE asumirá los impuestos, tasas y contribuciones que le correspondan conforme a la ley. El CONTRATANTE practicará las retenciones en la fuente y demás retenciones que resulten aplicables según la condición tributaria de cada CONTRATISTA ([[Régimen o condición tributaria, p. ej. no responsable de IVA / responsable de IVA / régimen simple]]) y expedirá los certificados correspondientes. Los valores retenidos se entenderán parte del pago efectuado.' },
    { t: 'p', text: 'El valor pactado no comprende gastos adicionales tales como [[gastos reembolsables, viajes, licencias de terceros, infraestructura u otros]], los cuales, de ser necesarios, serán aprobados previamente por escrito por el CONTRATANTE y reembolsados contra soporte.' },

    /* ---------------------------------------------------------- 8 */
    { t: 'h2', text: '8. ACEPTACIÓN DE ENTREGABLES' },
    { t: 'p', text: '8.1. Los CONTRATISTAS notificarán por escrito al CONTRATANTE la entrega de cada entregable. El CONTRATANTE dispondrá de [[Número]] ([[número en letras]]) días hábiles contados desde la notificación para revisarlo y comunicar por escrito su aprobación o sus observaciones.' },
    { t: 'p', text: '8.2. Las observaciones deberán ser concretas, estar fundadas en los criterios de aceptación pactados y referirse a aspectos comprendidos dentro del alcance contratado. Los CONTRATISTAS atenderán las observaciones procedentes dentro de un plazo razonable acordado por las PARTES, que no será inferior a [[Número]] días hábiles, sin costo adicional, y presentarán nuevamente el entregable para revisión.' },
    { t: 'p', text: '8.3. Si vencido el plazo de revisión el CONTRATANTE no se pronuncia, el entregable se entenderá aceptado para todos los efectos, incluido el pago asociado. Igualmente se entenderá aceptado cuando el CONTRATANTE lo utilice en su operación o lo ponga en producción.' },
    { t: 'p', text: '8.4. Las solicitudes que impliquen funcionalidades, características o actividades no incluidas en el alcance no se tratarán como observaciones y se tramitarán conforme a la cláusula 9.' },

    /* ---------------------------------------------------------- 9 */
    { t: 'h2', text: '9. CAMBIOS DE ALCANCE' },
    { t: 'p', text: '9.1. Cualquier funcionalidad, actividad, requerimiento o modificación adicional o distinta de lo previsto en la cláusula 4 y en los anexos constituye un cambio de alcance y requerirá aprobación previa y escrita de las PARTES.' },
    { t: 'p', text: '9.2. Ante una solicitud de cambio, los CONTRATISTAS presentarán al CONTRATANTE una propuesta que indique el impacto en el valor, en el cronograma y en los entregables. El cambio solo se ejecutará una vez aprobada la propuesta por escrito, mediante otrosí o mediante orden de cambio firmada o aceptada por correo electrónico por los representantes designados de las PARTES.' },
    { t: 'p', text: '9.3. Los cambios aprobados modificarán el precio y el cronograma en los términos acordados y harán parte integral del contrato.' },

    /* ---------------------------------------------------------- 10 */
    { t: 'h2', text: '10. INCUMPLIMIENTO Y MORA' },
    { t: 'p', text: '10.1. **Requerimiento previo.** Si alguna de las PARTES incumple una obligación a su cargo, la otra la requerirá por escrito, indicando el incumplimiento y otorgándole un plazo razonable para subsanarlo, que no será inferior a [[Número]] ([[número en letras]]) días hábiles, salvo que la naturaleza de la obligación exija un plazo distinto.' },
    { t: 'p', text: '10.2. **Consecuencias del incumplimiento de los Contratistas.** Si los CONTRATISTAS no subsanan el incumplimiento dentro del plazo otorgado, el CONTRATANTE podrá, a su elección: (i) exigir el cumplimiento; (ii) retener el pago asociado al entregable incumplido hasta su subsanación; o (iii) dar por terminado el contrato conforme a la cláusula 17, con derecho a la indemnización de los perjuicios que acredite, dentro de los límites de la cláusula 16.' },
    { t: 'p', text: '10.3. **Consecuencias del incumplimiento del Contratante.** Si el CONTRATANTE no subsana el incumplimiento dentro del plazo otorgado, los CONTRATISTAS podrán, a su elección: (i) exigir el cumplimiento; (ii) suspender la prestación de los servicios conforme a la cláusula 11; o (iii) dar por terminado el contrato conforme a la cláusula 17, con derecho al pago de los servicios ejecutados y de los entregables aceptados o en curso, y a la indemnización de los perjuicios que acrediten, dentro de los límites de la cláusula 16.' },
    { t: 'p', text: '10.4. **Mora en los pagos.** El retardo en el pago de cualquier suma a cargo del CONTRATANTE causará, sin necesidad de requerimiento, intereses de mora a la tasa máxima legal permitida para obligaciones mercantiles, esto es, la equivalente a una y media veces el interés bancario corriente certificado por la Superintendencia Financiera de Colombia, conforme al artículo 884 del Código de Comercio y a las normas que lo modifiquen o sustituyan, desde la fecha en que el pago debió efectuarse y hasta que se realice efectivamente.' },
    { t: 'p', text: '10.5. **Cláusula penal.** [[Opcional: las PARTES podrán pactar una cláusula penal por incumplimiento, equivalente al [●] % del valor del contrato, que se entenderá como estimación anticipada de perjuicios y no impedirá exigir el cumplimiento. Si no se desea pactar, eliminar este numeral.]]' },

    /* ---------------------------------------------------------- 11 */
    { t: 'h2', text: '11. SUSPENSIÓN DEL SERVICIO' },
    { t: 'p', text: '11.1. Los CONTRATISTAS podrán suspender la prestación de los servicios, previa comunicación escrita al CONTRATANTE con al menos [[Número]] días hábiles de antelación, cuando concurra alguna de las siguientes causas imputables al CONTRATANTE y esta no sea corregida dentro de dicho plazo:' },
    { t: 'ul', items: [
      'Falta de entrega de la información o definiciones necesarias para continuar la ejecución.',
      'Falta de los accesos, credenciales, ambientes o recursos acordados.',
      'Falta de las aprobaciones o decisiones requeridas para avanzar.',
      'Mora en el pago de cualquier suma vencida.',
      'Cualquier otro incumplimiento del CONTRATANTE que impida o afecte de manera sustancial la ejecución de los servicios.'
    ]},
    { t: 'p', text: '11.2. Las PARTES podrán, además, acordar por escrito la suspensión del contrato por causas distintas, incluidas las de fuerza mayor o caso fortuito.' },
    { t: 'p', text: '11.3. Durante la suspensión no correrán los plazos del cronograma. Una vez superada la causa, las PARTES ajustarán el cronograma prorrogando las fechas por un término al menos igual al de la suspensión, más el tiempo razonable que requiera la reanudación. Si la suspensión por causas imputables al CONTRATANTE se prolonga por más de [[Número]] días calendario, los CONTRATISTAS podrán dar por terminado el contrato conforme a la cláusula 17, con derecho al pago de lo ejecutado.' },

    /* ---------------------------------------------------------- 12 */
    { t: 'h2', text: '12. PROPIEDAD INTELECTUAL' },
    { t: 'h3', text: '12.1. Material preexistente de los Contratistas' },
    { t: 'p', text: 'Los CONTRATISTAS conservan la titularidad plena de todos los derechos de propiedad intelectual sobre el código, las herramientas, las librerías, las plantillas, los componentes, las metodologías, los procesos, el conocimiento técnico (know-how) y demás materiales que hayan desarrollado o adquirido con anterioridad a este contrato o de manera independiente de él (en adelante, el **Material Preexistente**), aun cuando dicho material se utilice o se incorpore en los entregables. Los CONTRATISTAS declaran el siguiente Material Preexistente relevante para el proyecto: [[Relación del material preexistente, o “Ninguno”]].' },
    { t: 'h3', text: '12.2. Software y componentes de terceros' },
    { t: 'p', text: 'Los entregables podrán incorporar software, librerías, servicios o componentes de terceros, incluidos los de código abierto, cuya titularidad corresponde a sus respectivos propietarios y cuyo uso se rige por sus propias licencias. Los CONTRATISTAS informarán al CONTRATANTE los componentes de terceros relevantes y sus licencias en el Anexo Técnico, y el CONTRATANTE se obliga a respetarlas. Las licencias comerciales de terceros que requiera el CONTRATANTE para su operación serán adquiridas por este a su costo, salvo pacto en contrario.' },
    { t: 'h3', text: '12.3. Material desarrollado específicamente para el Contratante' },
    { t: 'p', text: 'Se entiende por **Material Específico** el código, los documentos, los diseños y demás obras creadas por los CONTRATISTAS de manera original y específica para el CONTRATANTE en ejecución de este contrato, con exclusión del Material Preexistente y de los componentes de terceros. Las PARTES acuerdan que, una vez pagado íntegramente el valor correspondiente, el Material Específico será entregado al CONTRATANTE bajo la siguiente modalidad (marcar la que aplique):' },
    { t: 'table', cls: 'opciones', head: ['Marcar', 'Modalidad', 'Alcance'], rows: [
      ['[[ ]]', 'Transferencia (cesión) de derechos patrimoniales', 'Los CONTRATISTAS ceden al CONTRATANTE los derechos patrimoniales de autor sobre el Material Específico, en los términos de la Ley 23 de 1982 y demás normas aplicables, por el término legal y para todo territorio. Los derechos morales permanecen en cabeza de sus autores.'],
      ['[[ ]]', 'Licencia de uso amplia', 'Los CONTRATISTAS conservan la titularidad y otorgan al CONTRATANTE una licencia no exclusiva, irrevocable, transferible a sus filiales y sin límite de tiempo ni territorio para usar, reproducir, modificar y adaptar el Material Específico para sus fines propios.'],
      ['[[ ]]', 'Licencia de uso limitada', 'Los CONTRATISTAS conservan la titularidad y otorgan al CONTRATANTE una licencia no exclusiva para usar el Material Específico con las siguientes limitaciones: [[usuarios, sedes, finalidad, plazo u otras condiciones]].']
    ]},
    { t: 'p', text: 'En cualquiera de las modalidades, los CONTRATISTAS otorgan al CONTRATANTE, respecto del Material Preexistente incorporado en los entregables, una licencia no exclusiva, no transferible salvo a sus filiales, sin límite de tiempo y sin costo adicional, para usarlo únicamente como parte de los entregables y para los fines de este contrato. El CONTRATANTE no adquiere derecho alguno a explotar el Material Preexistente de manera independiente ni a sublicenciarlo a terceros.' },
    { t: 'h3', text: '12.4. Reglas comunes' },
    { t: 'ul', items: [
      'Las PARTES reconocen que, salvo lo expresamente pactado en esta cláusula, no se presume la transferencia de derechos de propiedad intelectual y que la presunción legal de cesión aplicable a las obras creadas por encargo se entiende limitada al Material Específico y condicionada al pago íntegro del valor pactado.',
      'Los CONTRATISTAS garantizan que el Material Específico es de su autoría y no infringe, a su leal saber y entender, derechos de terceros, y mantendrán indemne al CONTRATANTE frente a reclamaciones fundadas de terceros por dicha causa, dentro de los límites de la cláusula 16.',
      'Los CONTRATISTAS podrán mencionar al CONTRATANTE como cliente y describir de manera general el proyecto en su portafolio, sin revelar información confidencial, salvo que el CONTRATANTE manifieste por escrito su objeción.',
      'Nada de lo previsto en este contrato impide a los CONTRATISTAS utilizar su conocimiento general, experiencia y habilidades en proyectos para terceros, siempre que no utilicen información confidencial ni el Material Específico del CONTRATANTE.'
    ]},

    /* ---------------------------------------------------------- 13 */
    { t: 'h2', text: '13. CONFIDENCIALIDAD' },
    { t: 'p', text: '13.1. Se considera **Información Confidencial** toda información técnica, comercial, financiera, operativa, estratégica o de cualquier otra naturaleza, en cualquier medio o formato, que una PARTE revele a la otra con ocasión de este contrato y que haya sido identificada como confidencial o que, por su naturaleza o por las circunstancias de su revelación, deba razonablemente entenderse como tal. Se incluyen, entre otros, el código fuente, la documentación técnica, los datos de clientes y proveedores, las bases de datos, los planes de negocio, las condiciones económicas de este contrato y el Material Preexistente de los CONTRATISTAS.' },
    { t: 'p', text: '13.2. Cada PARTE se obliga a: (i) utilizar la Información Confidencial de la otra únicamente para la ejecución de este contrato; (ii) no revelarla a terceros sin autorización previa y escrita, salvo a sus colaboradores o asesores que necesiten conocerla y estén sujetos a obligaciones de confidencialidad equivalentes; (iii) protegerla con el mismo cuidado con que protege su propia información confidencial y, en todo caso, con un grado razonable de diligencia; y (iv) devolverla o destruirla a la terminación del contrato o cuando la otra PARTE lo solicite, salvo las copias que deban conservarse por exigencia legal.' },
    { t: 'p', text: '13.3. No se considera Información Confidencial la que: (i) sea o llegue a ser de dominio público sin incumplimiento de este contrato; (ii) estuviera legítimamente en poder de la PARTE receptora antes de su revelación; (iii) sea recibida legítimamente de un tercero sin restricción de confidencialidad; (iv) haya sido desarrollada de manera independiente; o (v) deba revelarse por mandato legal u orden de autoridad competente, caso en el cual la PARTE obligada informará a la otra, cuando sea legalmente posible, para que pueda adoptar las medidas de protección pertinentes.' },
    { t: 'p', text: '13.4. Las obligaciones de confidencialidad estarán vigentes durante la ejecución del contrato y por un término de [[Número]] ([[número en letras]]) años contados desde su terminación. Respecto de los secretos empresariales, la obligación se mantendrá mientras la información conserve tal carácter.' },

    /* ---------------------------------------------------------- 14 */
    { t: 'h2', text: '14. PROTECCIÓN DE DATOS PERSONALES' },
    { t: 'p', text: '14.1. Las PARTES se obligan a cumplir la Ley 1581 de 2012, el Decreto 1377 de 2013 (compilado en el Decreto 1074 de 2015), la Ley 1266 de 2008 en lo pertinente y las demás normas que las modifiquen, adicionen o sustituyan, así como las instrucciones de la Superintendencia de Industria y Comercio en materia de protección de datos personales.' },
    { t: 'p', text: '14.2. Cada PARTE autoriza a la otra el tratamiento de los datos personales de sus representantes, contactos y colaboradores que se suministren con ocasión de este contrato, con la finalidad exclusiva de su ejecución, gestión administrativa, facturación y cumplimiento de obligaciones legales. Los titulares podrán ejercer sus derechos de conocer, actualizar, rectificar y suprimir sus datos y revocar la autorización a través de los canales de notificación previstos en la cláusula 21.' },
    { t: 'p', text: '14.3. Si la prestación de los servicios implica que los CONTRATISTAS accedan a, recolecten, almacenen o de cualquier forma traten datos personales de los que el CONTRATANTE sea responsable (por ejemplo, datos de sus clientes, usuarios o empleados), las PARTES definirán por escrito, en el Anexo Técnico o en un acuerdo de tratamiento de datos, como mínimo: (i) sus respectivos roles como responsable o encargado del tratamiento; (ii) las finalidades autorizadas; (iii) las categorías de datos y de titulares; (iv) las medidas de seguridad técnicas y administrativas; (v) el procedimiento de atención de consultas y reclamos de los titulares; (vi) las reglas sobre transferencia o transmisión de datos, incluida la internacional; y (vii) el destino de los datos a la terminación del contrato.' },
    { t: 'p', text: '14.4. En tal caso, los CONTRATISTAS tratarán los datos únicamente conforme a las instrucciones del CONTRATANTE, guardarán reserva sobre ellos, adoptarán las medidas de seguridad acordadas e informarán al CONTRATANTE, sin dilación injustificada, sobre cualquier incidente de seguridad que los afecte. El CONTRATANTE garantiza que cuenta con la autorización de los titulares o con otra base legal para el tratamiento que encargue.' },

    /* ---------------------------------------------------------- 15 */
    { t: 'h2', text: '15. INDEPENDENCIA DE LAS PARTES' },
    { t: 'p', text: '15.1. Los CONTRATISTAS prestarán los servicios con plena autonomía técnica, administrativa y directiva, con sus propios medios, herramientas y organización, sin subordinación ni dependencia respecto del CONTRATANTE y sin sujeción a horario, sin perjuicio de la coordinación razonable, de la atención de reuniones acordadas y del cumplimiento de los entregables y plazos pactados, que son propios de una relación de servicios independientes.' },
    { t: 'p', text: '15.2. En consecuencia, el presente contrato no constituye, por sí mismo, una relación laboral entre el CONTRATANTE y ninguno de los CONTRATISTAS, ni una sociedad, consorcio, unión temporal, agencia comercial, mandato o representación entre las PARTES. Ninguna PARTE podrá actuar en nombre de la otra ni obligarla frente a terceros, salvo autorización expresa y escrita.' },
    { t: 'p', text: '15.3. Las PARTES reconocen que la naturaleza de la relación se determina por la forma en que se ejecuta en la práctica y no únicamente por la denominación del contrato. Por ello, se comprometen a ejecutarlo de manera coherente con su carácter independiente: el CONTRATANTE se abstendrá de ejercer subordinación y los CONTRATISTAS organizarán libremente su trabajo. Si en la práctica llegaren a configurarse los elementos de una relación distinta, se aplicarán las consecuencias que la ley prevea, sin que esta cláusula pueda invocarse para desconocerlas.' },
    { t: 'p', text: '15.4. Cada CONTRATISTA asume, por su cuenta y riesgo, el cumplimiento de sus obligaciones tributarias, de seguridad social y demás cargas propias de su condición de trabajador independiente, y mantendrá indemne al CONTRATANTE frente a reclamaciones derivadas de su incumplimiento, de la misma manera que el CONTRATANTE mantendrá indemnes a los CONTRATISTAS frente a reclamaciones derivadas del incumplimiento de las obligaciones propias del CONTRATANTE.' },

    /* ---------------------------------------------------------- 16 */
    { t: 'h2', text: '16. RESPONSABILIDAD' },
    { t: 'p', text: '16.1. Cada PARTE responderá frente a la otra por los perjuicios directos, ciertos y debidamente acreditados que le cause por el incumplimiento de las obligaciones a su cargo, conforme a las reglas generales de responsabilidad contractual previstas en la legislación colombiana.' },
    { t: 'p', text: '16.2. Salvo en los casos de dolo o culpa grave, de incumplimiento de las obligaciones de confidencialidad o de protección de datos, o de infracción de derechos de propiedad intelectual de terceros, y en la medida en que la ley lo permita, ninguna PARTE será responsable frente a la otra por lucro cesante, pérdida de oportunidad, daño reputacional o perjuicios indirectos o consecuenciales.' },
    { t: 'p', text: '16.3. En los mismos términos, la responsabilidad total de cada PARTE derivada de este contrato se limita a [[Límite acordado, p. ej. el valor total del contrato o el valor efectivamente pagado]]. Esta limitación no aplica cuando la ley no admita limitar la responsabilidad ni a la obligación del CONTRATANTE de pagar el valor de los servicios.' },
    { t: 'p', text: '16.4. Los CONTRATISTAS no serán responsables por fallas, retrasos o daños originados en información inexacta o incompleta suministrada por el CONTRATANTE, en decisiones adoptadas por este contra la recomendación escrita de los CONTRATISTAS, en modificaciones realizadas a los entregables por el CONTRATANTE o por terceros, ni en la operación de software, servicios o infraestructura de terceros.' },
    { t: 'p', text: '16.5. **Garantía.** Los CONTRATISTAS corregirán, sin costo adicional, los defectos del Material Específico que le sean reportados por escrito dentro de los [[Número]] días calendario siguientes a la aceptación del respectivo entregable, siempre que se deban a causas imputables a los CONTRATISTAS y no a las circunstancias descritas en el numeral anterior. Los servicios de soporte, mantenimiento o evolución posteriores a dicho periodo se regirán por un acuerdo separado.' },

    /* ---------------------------------------------------------- 17 */
    { t: 'h2', text: '17. VIGENCIA Y TERMINACIÓN' },
    { t: 'p', text: '17.1. **Vigencia.** El presente contrato rige desde el [[Fecha de inicio]] hasta el [[Fecha de finalización]] o hasta la aceptación del último entregable, lo que ocurra primero, sin perjuicio de las obligaciones que por su naturaleza subsistan. El contrato [[se renovará automáticamente por periodos de [●] / no se renovará automáticamente]], salvo que cualquiera de las PARTES manifieste por escrito su intención de no renovarlo con al menos [[Número]] días de antelación.' },
    { t: 'p', text: '17.2. **Terminación por mutuo acuerdo.** Las PARTES podrán terminar el contrato en cualquier momento por mutuo acuerdo, que constará por escrito, liquidando los servicios ejecutados hasta la fecha.' },
    { t: 'p', text: '17.3. **Terminación por incumplimiento.** Cualquiera de las PARTES podrá terminar el contrato por incumplimiento grave de la otra, previo el requerimiento y el plazo de subsanación previstos en la cláusula 10, mediante comunicación escrita.' },
    { t: 'p', text: '17.4. **Terminación anticipada sin causa.** Cualquiera de las PARTES podrá terminar el contrato de manera anticipada y sin necesidad de invocar causa, mediante preaviso escrito de al menos [[Número]] ([[número en letras]]) días calendario. En este caso, el CONTRATANTE pagará a los CONTRATISTAS el valor de los servicios efectivamente prestados y de los entregables aceptados o en curso hasta la fecha efectiva de terminación, en proporción a su avance, más los gastos no recuperables en que hayan incurrido con ocasión del contrato y que estén debidamente soportados. Los CONTRATISTAS entregarán el trabajo en el estado en que se encuentre.' },
    { t: 'p', text: '17.5. **Otras causales.** El contrato podrá terminarse, además, por: (i) fuerza mayor o caso fortuito que impida su ejecución por más de [[Número]] días, conforme a la cláusula 18; (ii) suspensión prolongada en los términos de la cláusula 11; (iii) liquidación, insolvencia o disolución del CONTRATANTE; o (iv) imposibilidad definitiva de alguno de los CONTRATISTAS de continuar la ejecución, caso en el cual las PARTES acordarán si el otro CONTRATISTA continúa la ejecución en las condiciones que se pacten.' },
    { t: 'p', text: '17.6. **Obligaciones posteriores a la terminación.** A la terminación del contrato por cualquier causa: (i) el CONTRATANTE pagará las sumas causadas y pendientes; (ii) los CONTRATISTAS entregarán los entregables terminados o en curso que hayan sido pagados y devolverán los accesos, credenciales e información del CONTRATANTE; (iii) las PARTES suscribirán, si así lo solicita cualquiera de ellas, un acta de liquidación; y (iv) continuarán vigentes las cláusulas de propiedad intelectual, confidencialidad, protección de datos, responsabilidad, solución de controversias y las demás que por su naturaleza deban subsistir.' },

    /* ---------------------------------------------------------- 18 */
    { t: 'h2', text: '18. FUERZA MAYOR O CASO FORTUITO' },
    { t: 'p', text: '18.1. Ninguna de las PARTES será responsable por el incumplimiento o el retraso en el cumplimiento de sus obligaciones, distintas de las de pago de sumas de dinero ya causadas, cuando este se deba a fuerza mayor o caso fortuito en los términos del artículo 64 del Código Civil colombiano, esto es, a un imprevisto al que no es posible resistir, tales como desastres naturales, actos de autoridad, guerra, conmoción interior, epidemias, fallas generalizadas de servicios públicos o de telecomunicaciones u otros hechos de similar naturaleza, ajenos a la voluntad y al control de la PARTE afectada.' },
    { t: 'p', text: '18.2. La PARTE afectada informará a la otra por escrito, dentro de los [[Número]] días hábiles siguientes a la ocurrencia del hecho, indicando su naturaleza, su impacto estimado y las medidas adoptadas para mitigarlo. Los plazos afectados se prorrogarán por un término igual al de la duración del evento.' },
    { t: 'p', text: '18.3. Si el evento se prolonga por más de [[Número]] días calendario, cualquiera de las PARTES podrá terminar el contrato mediante comunicación escrita, sin lugar a indemnización, con la liquidación de los servicios ejecutados hasta la fecha.' },

    /* ---------------------------------------------------------- 19 */
    { t: 'h2', text: '19. SOLUCIÓN DE CONTROVERSIAS' },
    { t: 'p', text: '19.1. **Negociación directa.** Toda controversia derivada de la celebración, ejecución, interpretación, terminación o liquidación de este contrato será sometida, en primer lugar, a negociación directa entre los representantes de las PARTES, quienes se reunirán dentro de los [[Número]] días hábiles siguientes a la solicitud escrita de cualquiera de ellas y procurarán llegar a un acuerdo en un plazo máximo de [[Número]] días hábiles.' },
    { t: 'p', text: '19.2. **Conciliación.** Si la negociación directa no prospera, las PARTES acudirán a conciliación extrajudicial en derecho ante un centro de conciliación legalmente autorizado en la ciudad de [[Ciudad]], conforme a la Ley 2220 de 2022 y demás normas aplicables.' },
    { t: 'p', text: '19.3. **Jurisdicción.** Agotadas las etapas anteriores sin acuerdo, o cuando la conciliación no sea requisito exigible, cualquiera de las PARTES podrá acudir a la jurisdicción ordinaria de la República de Colombia, ante los jueces competentes según las reglas generales.' },
    { t: 'p', text: '19.4. Lo anterior no impide que cualquiera de las PARTES solicite las medidas cautelares o urgentes que la ley autorice para proteger sus derechos.' },

    /* ---------------------------------------------------------- 20 */
    { t: 'h2', text: '20. LEGISLACIÓN APLICABLE' },
    { t: 'p', text: 'El presente contrato se rige e interpreta de conformidad con las leyes de la República de Colombia, en particular por el Código Civil, el Código de Comercio y las demás normas que resulten aplicables a su naturaleza y objeto.' },

    /* ---------------------------------------------------------- 21 */
    { t: 'h2', text: '21. NOTIFICACIONES' },
    { t: 'p', text: '21.1. Las comunicaciones y notificaciones entre las PARTES se realizarán por escrito y se entenderán recibidas: (i) en la fecha de confirmación de lectura o de respuesta, si se envían por correo electrónico; (ii) en la fecha de entrega, si se envían por correo certificado o se entregan personalmente en la dirección indicada.' },
    { t: 'table', cls: 'datos', head: ['Parte', 'Correo electrónico', 'Dirección física', 'Persona de contacto'], rows: [
      ['CONTRATANTE', '[[Correo electrónico]]', '[[Dirección y ciudad]]', '[[Nombre y cargo]]'],
      ['CONTRATISTA 1', '[[Correo electrónico]]', '[[Dirección y ciudad]]', '[[Nombre]]'],
      ['CONTRATISTA 2', '[[Correo electrónico]]', '[[Dirección y ciudad]]', '[[Nombre]]']
    ]},
    { t: 'p', text: '21.2. Las PARTES podrán utilizar, adicionalmente, la herramienta de gestión o el canal de mensajería que acuerden por escrito para la coordinación operativa del proyecto, sin que ello sustituya los medios anteriores para efectos de requerimientos, aprobaciones de cambios de alcance y terminación. Cualquier cambio en los datos de notificación deberá informarse por escrito a la otra PARTE.' },

    /* ---------------------------------------------------------- 22 */
    { t: 'h2', text: '22. INTEGRIDAD DEL ACUERDO' },
    { t: 'p', text: '22.1. El presente contrato, junto con sus anexos, constituye el acuerdo íntegro entre las PARTES respecto de su objeto y reemplaza cualquier propuesta, cotización, comunicación o acuerdo anterior, verbal o escrito, sobre la misma materia. En caso de contradicción entre el cuerpo del contrato y sus anexos, prevalecerá el cuerpo del contrato, salvo en los aspectos técnicos de detalle, en los que prevalecerá el Anexo Técnico.' },
    { t: 'p', text: '22.2. Toda modificación del contrato deberá constar por escrito y estar firmada o aceptada expresamente por las PARTES, mediante otrosí u orden de cambio conforme a la cláusula 9. La tolerancia de una PARTE frente al incumplimiento de la otra no constituye renuncia a sus derechos ni modificación del contrato.' },
    { t: 'p', text: '22.3. Si alguna cláusula fuere declarada nula o ineficaz, las demás conservarán plena validez y las PARTES la reemplazarán por otra válida que refleje, en lo posible, su intención original.' },
    { t: 'p', text: '22.4. El presente contrato podrá firmarse de manera manuscrita o mediante firma electrónica o digital, en los términos de la Ley 527 de 1999 y del Decreto 2364 de 2012 (compilado en el Decreto 1074 de 2015), y podrá suscribirse en ejemplares separados, que en conjunto constituirán un solo documento.' },

    /* ---------------------------------------------------------- 23 */
    { t: 'h2', text: '23. ANEXOS' },
    { t: 'p', text: 'Hacen parte integral del presente contrato los siguientes anexos, los cuales se entienden incorporados a él y deberán ser suscritos o aceptados por escrito por las PARTES:' },
    { t: 'table', cls: 'anexos', head: ['Anexo', 'Contenido', 'Fecha / versión'], rows: [
      ['Anexo 1 — Anexo Técnico', 'Especificaciones de los servicios, arquitectura o metodología, componentes de terceros y licencias, requisitos de accesos y recursos, roles en el tratamiento de datos personales (si aplica).', '[[Fecha / versión]]'],
      ['Anexo 2 — Anexo Comercial', 'Distribución de actividades y de la remuneración entre los CONTRATISTAS, condiciones económicas complementarias y gastos reembolsables.', '[[Fecha / versión]]'],
      ['Anexo 3 — Cronograma', 'Fechas de inicio y fin de cada fase o actividad, hitos y dependencias a cargo del CONTRATANTE.', '[[Fecha / versión]]'],
      ['Anexo 4 — Tabla de entregables', 'Relación detallada de entregables, características, fechas y criterios de aceptación.', '[[Fecha / versión]]'],
      ['Anexo 5 — Forma de pago', 'Detalle de hitos de pago, anticipos, condiciones y cuentas de pago.', '[[Fecha / versión]]'],
      ['Anexo 6 — Otros', '[[Otros documentos que las PARTES acuerden, p. ej. acuerdo de tratamiento de datos, propuesta comercial aceptada]]', '[[Fecha / versión]]']
    ]},

    /* ---------------------------------------------------------- 24 */
    { t: 'pagebreak' },
    { t: 'h2', text: '24. FIRMAS' },
    { t: 'p', text: 'En constancia de lo anterior, las PARTES firman el presente contrato en la ciudad de [[Ciudad]], el día [[Día]] de [[Mes]] de [[Año]], en [[Número de ejemplares]] ejemplares del mismo tenor y valor, uno para cada una de ellas.' },
    { t: 'sign', signers: [
      { id: 'contratante', role: 'Por el CONTRATANTE', fields: [['Nombre', 'Nombre completo del representante legal'], ['Cargo', 'Representante legal'], ['Documento', 'Tipo y número'], ['NIT de la empresa', 'NIT'], ['Fecha', 'Fecha']] },
      { id: 'contratista1', role: 'CONTRATISTA 1', fields: [['Nombre', 'Nombre completo'], ['Documento', 'Cédula de ciudadanía'], ['Fecha', 'Fecha']] },
      { id: 'contratista2', role: 'CONTRATISTA 2', fields: [['Nombre', 'Nombre completo'], ['Documento', 'Cédula de ciudadanía'], ['Fecha', 'Fecha']] }
    ]},

    { t: 'note', text: '**Nota importante.** Este documento es un modelo de referencia elaborado con base en el contexto jurídico y comercial colombiano y no constituye asesoría jurídica personalizada. Las condiciones particulares de cada negocio pueden requerir ajustes. Antes de su firma definitiva, el documento debe ser revisado por un abogado colombiano, quien verificará su adecuación a la situación concreta de las partes y a la normativa vigente en ese momento.' }
  ]
};
