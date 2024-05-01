import { useState, useEffect } from "react";
import translate from "../translate";
import promptsImport from "../assets/prompts.json";
import languages from "../assets/languages.json";

type PromptLanguage = {
	initialPrompt: string;
	startPart: string;
	endPart: string;
	startFinalPart: string;
	endFinalPart: string;
};
type Prompts = {
	[key: string]: PromptLanguage;
};

const prompts: Prompts = promptsImport;

const Splitter = () => {
	const [text, setText] = useState<string>("");
	const [chunks, setChunks] = useState<string[]>([]);
	const [textLanguage, setTextLanguage] = useState<string>("en");
	const [targetLanguage, setTargetLanguage] = useState<string>("");

	const [promptList, setPromptList] = useState<PromptLanguage>(prompts.en);
	console.log(promptList);
	const [promptLengths, setPromptLengths] = useState<number[]>(
		[3, 2]//Object.values(promptList).map((prompt: string) => prompt.length)
	);

	translate.getLanguage(text).then((language) => {
		setTextLanguage(language);
	});

	useEffect(() => {
		setTargetLanguage(textLanguage);
	}, [textLanguage]);

	useEffect(() => {
        // alert("translatin to "+ targetLanguage);
		async function getTranslatePrompts() {
			return Object.values(prompts.en).map((prompt: string) =>
				translate.translateText(prompt, targetLanguage)
			);
		}

		prompts[targetLanguage]
			? setPromptList(prompts[targetLanguage])
			: getTranslatePrompts().then(
					(translatedPrompts: Promise<PromptLanguage>[]) => {
						console.log(translatedPrompts);
						Promise.all(
							translatedPrompts.map((p) => p.catch((e) => e))
						).then((results) => {
							// Check for errors
							const errors = results.filter(
								(result) => result instanceof Error
							);
							if (errors.length > 0) {
								// Handle errors
								console.error("There was an error:", errors);
							} else {
								// All promises resolved successfully
								console.log("All promises resolved:", results);
							}

							setPromptList({
								initialPrompt: results[0],
								startPart: results[1],
								endPart: results[2],
								startFinalPart: results[3],
								endFinalPart: results[4],
							});
						});
					}
			  );
		console.log(promptList);
	}, [targetLanguage]);

	const splitText = (inputText: string) => {
		const chunkSize = 15000;
		const textLength = inputText.length;
		const numChunks = Math.ceil(textLength / chunkSize);

		const textChunks: string[] = [];
		let start = 0;
		let end = chunkSize;

		for (let i = 0; i < numChunks; i++) {
			const chunk = inputText.substring(start, end);
			textChunks.push(chunk);
			start = end;
			end = start + chunkSize;
		}

		setChunks(textChunks);
	};

	const handleSplit = () => {
		splitText(text);
	};

	return (
		<div>
			<textarea
				placeholder="Enter text to split"
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={10}
				cols={50}
			/>
			<>
				<label htmlFor="languages">Choose a language:</label>
				<select
					id="languages"
					name="languages"
					value={targetLanguage}
					onChange={(e) => setTargetLanguage(e.target.value)}
				>
					{languages.map((language, index) => (
						<option key={index} value={language.code}>
							{language.name}
						</option>
					))}
				</select>
			</>
			<button onClick={handleSplit}>Split Text</button>
			<div>
				{chunks.map((chunk: string, index: number) => (
					<div key={index}>
						<h3>Chunk {index + 1}</h3>
						<p>{chunk + promptList.startFinalPart}</p>
					</div>
				))}
			</div>
			{textLanguage && <p>Language: {textLanguage}</p>}
		</div>
	);
};

export default Splitter;
