import { useState } from "react";
import axios from "axios";

const Translator = () => {
	const [inputText, setInputText] = useState("");
	const [targetLanguage, setTargetLanguage] = useState("en");
	const [translatedText, setTranslatedText] = useState("");

	async function translateText(text: string, target: string ) {
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
			console.log(response.data);
			setTranslatedText(response.data[0].translations[0].text);
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<div>
			<h1>Text Translator</h1>
			<textarea
				id="inputText"
				rows={5}
				cols={50}
				placeholder="Enter text to translate"
				onChange={(e) => setInputText(e.target.value)}
			></textarea>
			<select
				id="targetLanguage"
				onChange={(e) => setTargetLanguage(e.target.value)}
			>
				<option value="en">English</option>
				<option value="fr">French</option>
				<option value="es">Spanish</option>
			</select>
			<button onClick={() => translateText(inputText, targetLanguage)}>Translate</button>
			<h2>Translated Text</h2>
			<div id="translatedText">{translatedText}</div>
		</div>
	);
};

export default Translator;
