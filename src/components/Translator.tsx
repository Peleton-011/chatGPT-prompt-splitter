import { useState } from "react";
import translateText from "../translate";

const Translator = () => {
	const [inputText, setInputText] = useState("");
	const [targetLanguage, setTargetLanguage] = useState("en");
	const [translatedText, setTranslatedText] = useState("");

    translateText(inputText, targetLanguage).then((text) => {
        setTranslatedText(text);
    });
	
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
