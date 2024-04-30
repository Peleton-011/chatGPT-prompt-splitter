import { useState } from "react";

const Translator = () => {
	const [inputText, setInputText] = useState("");
	const [targetLanguage, setTargetLanguage] = useState("en");
	const [translatedText, setTranslatedText] = useState("");

	function translateText() {
		// Google Translate API endpoint
		const endpoint =
			"https://translation.googleapis.com/language/translate/v2?key=YOUR_API_KEY";

		// Construct request parameters
		var params = {
			q: inputText,
			target: targetLanguage,
		};

		// Make POST request to Google Translate API
		fetch(endpoint, {
			method: "POST",
			body: JSON.stringify(params),
		})
			.then((response) => response.json())
			.then((data) => {
				// Display translated text
				setTranslatedText(data.translations[0].translatedText);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
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
			<button onClick={translateText}>Translate</button>
			<h2>Translated Text</h2>
			<div id="translatedText">{translatedText}</div>
		</div>
	);
};

export default Translator;
