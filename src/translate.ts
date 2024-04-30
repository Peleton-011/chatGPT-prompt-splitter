import axios from "axios";

async function getLanguage(text: string) {
    const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
        params: {
          'api-version': '3.0'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'eeb86a1312msh5854a4f02f2b24dp1efa14jsn77a77b7a3088',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: text
          }
        ]
      };
      
      try {
          const response = await axios.request(options);
          return response.data[0].language;
      } catch (error) {
          console.error(error);
      }
}

async function translateText(text: string, target: string) {
	const options = {
		method: "POST",
		url: "https://microsoft-translator-text.p.rapidapi.com/translate",
		params: {
			"api-version": "3.0",
			"to[0]": target,
			textType: "plain",
			profanityAction: "NoAction",
		},
		headers: {
			"content-type": "application/json",
			"X-RapidAPI-Key":
				"eeb86a1312msh5854a4f02f2b24dp1efa14jsn77a77b7a3088",
			"X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
		},
		data: [
			{
				Text: text,
			},
		],
	};

	try {
		const response = await axios.request(options);
		return response.data[0].translations[0].text;
	} catch (error) {
		console.error(error);
	}
}

export default {
	translateText,
    getLanguage
};
