import axios from "axios";

async function setLanguageList() {
	const options = {
		method: "GET",
		url: "https://microsoft-translator-text.p.rapidapi.com/languages",
		params: {
			"api-version": "3.0",
			scope: "translation",
		},
		headers: {
            "content-type": "application/json",
			"X-RapidAPI-Key":
				"eeb86a1312msh5854a4f02f2b24dp1efa14jsn77a77b7a3088",
			"X-RapidAPI-Host": "microsoft-translator-text.p.rapidapi.com",
		},
        
	};

	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

export default setLanguageList;
