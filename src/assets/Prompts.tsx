export default {
	en: {
		initialPrompt: `
        The total length of the content that I want to send you is too large to send in only one piece.
        
For sending you that content, I will follow this rule:
        
[START PART 1/10]
this is the content of the part 1 out of 10 in total
[END PART 1/10]
        
Then you just answer: "Received part 1/10"
        
And when I tell you "ALL PARTS SENT", then you can continue processing the data and answering my requests.
    `,
		startPart: `
    Do not answer yet. This is just another part of the text I want to send you. Just receive and acknowledge as "Part 1/2 received" and wait for the next part.
    [START PART 1/2]
    `,
		endPart: `
    [END PART 1/2]
    Remember not answering yet. Just acknowledge you received this part with the message "Part 1/2 received" and wait for the next part.
    `,
		startFinalPart: `[START PART 2/2]`,
		endFinalPart: `
    [END PART 2/2]
    ALL PARTS SENT. Now you can continue processing the request.`,
	},
	es: {
		initialPrompt: `
         La longitud total del contenido que quiero enviarte es demasiado grande para enviarlo en una sola pieza.
        
Para enviarte ese contenido, seguiré esta regla:
        
[INICIO PARTE 1/10]
este es el contenido de la parte 1 de 10 en total
[FIN PARTE 1/10]
        
Entonces simplemente respondes: "Recibido parte 1/10"
        
Y cuando te diga "TODAS LAS PIEZAS ENVIADAS", entonces podrás seguir procesando los datos y atendiendo mis solicitudes.
     `,
		startPart: `
     No respondas todavía. Esta es sólo otra parte del texto que quiero enviarles. Simplemente reciba y reconozca como "Parte 1/2 recibida" y espere la siguiente parte.
     [INICIO PARTE 1/2]
     `,
		endPart: `
     [FIN PARTE 1/2]
     Recuerde que aún no ha respondido. Simplemente confirme que recibió esta parte con el mensaje "Parte 1/2 recibida" y espere la siguiente parte.
     `,
		startFinalPart: `[INICIAR PARTE 2/2]`,
		endFinalPart: `
     [FIN PARTE 2/2]
     TODAS LAS PIEZAS ENVIADAS. Ahora puede continuar procesando la solicitud.`,
	},
	cat: {
		initialPrompt: `
    La longitud total del contingut que vull enviar-te és massa gran per enviar-te només una peça.
   
Per enviar-te aquest contingut, seguiré aquesta regla:
   
[INICIA LA PART 1/10]
aquest és el contingut de la part 1 de cada 10 en total
[FI PART 1/10]
   
Aleshores només respons: "Rebut part 1/10"
   
I quan et digui "TOTES LES PARTS ENVIATS", llavors pots continuar processant les dades i responent a les meves peticions.
`,
		startPart: `
No respongui encara. Aquesta és només una part més del text que us vull enviar. Només heu de rebre i reconèixer com a "Part 1/2 rebuda" i esperar a la següent part.
[INICIA LA PART 1/2]
`,
		endPart: `
[FI PART 1/2]
Recordeu que encara no heu contestat. Només cal que confirmeu que heu rebut aquesta part amb el missatge "Part 1/2 rebuda" i espereu la següent part.
`,
		startFinalPart: `[START PART 2/2]`,
		endFinalPart: `
[FI PART 2/2]
TOTES LES PARTS ENVIATS. Ara podeu continuar processant la sol·licitud.`,
	},
};
