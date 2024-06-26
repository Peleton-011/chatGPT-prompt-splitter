import { useState, useEffect } from "react";
import translate from "../translate";
import promptsImport from "../assets/prompts.json";
import languages from "../assets/languages.json";

import CopyButton from "./CopyButton";
import CustomDropdown from "./CustomDropdown";

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
	const [chunkSize, setChunkSize] = useState<number>(15000);
	const [textLanguage, setTextLanguage] = useState<string>("en");
	const [targetLanguage, setTargetLanguage] = useState<string>("");

	const [isResponseTooShort, setIsResponseTooShort] =
		useState<boolean>(false);

	const [promptList, setPromptList] = useState<PromptLanguage>(prompts.en);
	console.log(promptList);
	const [promptLengths, setPromptLengths] = useState<number[]>(
		Array(5).fill(0)
	);

    useEffect(() => {
        translate.getLanguage(text).then((language) => {
            setTextLanguage(language);
        });
    }, [text]);

	useEffect(() => {
		setTargetLanguage(textLanguage);
	}, [textLanguage]);

	function translatePrompts() {
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
	}

	useEffect(() => {
		Object.values(promptList).every((prompt) => prompt !== undefined)
			? setPromptLengths(
					Object.values(promptList).map(
						(prompt: string) => prompt.length
					)
			  )
			: setPromptLengths(Array(5).fill(0));
	}, [promptList]);

	const splitText = (inputText: string) => {
		//--------
		translatePrompts();
		//--------
		const textLength = inputText.length;

		console.log(textLength);

		const normalChunkSize =
			chunkSize - (promptLengths[1] + promptLengths[2]);
		const lastChunkSize = chunkSize - (promptLengths[3] + promptLengths[4]);

		console.log(lastChunkSize, normalChunkSize);

		const numChunks = Math.ceil(
			(textLength - lastChunkSize) / normalChunkSize
		);

		console.log(
			numChunks,
			Math.ceil((textLength - lastChunkSize) / normalChunkSize)
		);
		const textChunks: string[] = [promptList.initialPrompt];
		let start = 0;
		let end = normalChunkSize;

		for (let i = 0; i < numChunks; i++) {
			const chunk =
				promptList.startPart.replace(
					"001/002",
					String(i + 1).padStart(3, "0") +
						"/" +
						String(numChunks + 1).padStart(3, "0")
				) +
				inputText.substring(start, end) +
				promptList.endPart.replace(
					"001/002",
					String(i + 1).padStart(3, "0") +
						"/" +
						String(numChunks + 1).padStart(3, "0")
				);
			textChunks.push(chunk);
			start = end;
			end = start + normalChunkSize;
		}

		const chunk =
			promptList.startFinalPart.replace(
				"002/002",
				String(numChunks + 1).padStart(3, "0") +
					"/" +
					String(numChunks + 1).padStart(3, "0")
			) +
			inputText.substring(start, end + lastChunkSize - normalChunkSize) +
			promptList.endFinalPart.replace(
				"002/002",
				String(numChunks + 1).padStart(3, "0") +
					"/" +
					String(numChunks + 1).padStart(3, "0")
			);
		textChunks.push(chunk);

		setChunks(textChunks);
	};

	const handleSplit = () => {
		if (text.length < chunkSize) {
			setIsResponseTooShort(true);
			return;
		}
		setIsResponseTooShort(false);
		splitText(text);
	};

	const options = [
		{ label: "ChatGPT (15000 characters)", value: "15000" },
		{ label: "Gemini (20000 characters)", value: "20000" },
	];

	return (
		<main className="container">
			<h1 style={{ margin: "4rem 0px" }}>ChatGPT 🤖 prompt Splitter</h1>
			<textarea
				placeholder="Enter text to split"
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={10}
				cols={50}
			/>
			<div className="grid">
				<div>
					<label htmlFor="languages">Choose a language:</label>
					<select
						id="languages"
						name="languages"
						value={targetLanguage}
						onChange={(e) => setTargetLanguage(e.target.value)}
					>
						{languages[languages[0].length ? 0 : 1].map(
							(language, index) => (
								<option key={index} value={language.code}>
									{language.name}
								</option>
							)
						)}
					</select>
				</div>
				<div>
					<label htmlFor="length">Choose an output length:</label>
					<CustomDropdown
						options={options}
						onSelect={(value) => setChunkSize(Number(value))}
					/>
				</div>
			</div>
			<button onClick={handleSplit}>Split Text</button>
			{isResponseTooShort && (
				<h3 style={{ margin: "1rem 0px" }}>
					Text is too short to split!
				</h3>
			)}
			<div className="grid" style={{ margin: "4rem 0px" }}>
				{chunks.map((chunk: string, index: number) => {
					return (
						<CopyButton
							key={index}
							text={chunk}
							name={"Chunk " + (index + 1)}
						/>
					);
				})}
				{false &&
					chunks.map((chunk: string, index: number) => (
						<div key={index}>
							<h3>Chunk {index + 1}</h3>
							<p>{chunk}</p>
						</div>
					))}
			</div>
			{/* {textLanguage && <p>Language: {textLanguage}</p>} */}
		</main>
	);
};

export default Splitter;
