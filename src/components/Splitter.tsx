import { useState, useEffect } from "react";
import translate from "../translate";
import promptsImport from "../assets/prompts.json";
import languagesImport from "../assets/languages.json";

import CopyButton from "./CopyButton";

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

type Language = {
	code: string;
	name: string;
	native: string;
	rtl?: boolean | number | undefined;
};

const prompts: Prompts = promptsImport;

const Splitter = () => {
	const [text, setText] = useState<string>("");
	const [chunks, setChunks] = useState<string[]>([]);
	const [chunkSize, setChunkSize] = useState<number>(15000);
	const [selectedLanguage, setSelectedLanguage] = useState<string>("es"); // Default set to Spanish
	const [textLanguage, setTextLanguage] = useState<string>("es"); // Match Spanish default
	const [detectedLanguageName, setDetectedLanguageName] =
		useState<string>("Spanish"); // Default detection name to Spanish

	const [isResponseTooShort, setIsResponseTooShort] =
		useState<boolean>(false);
	const [promptList, setPromptList] = useState<PromptLanguage>(prompts.es); // Set default prompts to Spanish
	const [promptLengths, setPromptLengths] = useState<number[]>(
		Array(5).fill(0)
	);

	const languages = [
		...languagesImport[0],
		{ name: "Auto Detect", code: "autodetect", native: "Auto Detect" },
	] as Language[];

	// Run language detection when the textarea loses focus
	const handleBlur = async () => {
		if (selectedLanguage === "autodetect" && text.trim()) {
			const detectedCode = await translate.getLanguage(text);
			setTextLanguage(detectedCode);

			// Update detected language name
			const detectedLang = languages.find(
				(lang) => lang.code === detectedCode
			);
			setDetectedLanguageName(detectedLang?.name || "Unknown");
		}
	};

	// Update language when a new language is selected
	useEffect(() => {
		if (selectedLanguage !== "autodetect") {
			setTextLanguage(selectedLanguage);
		}
	}, [selectedLanguage]);

	// Translate prompts when the language changes
	useEffect(() => {
		if (textLanguage in prompts) {
			setPromptList(prompts[textLanguage]);
		} else {
			translatePrompts();
		}
	}, [textLanguage]);

	// Translate prompts into the target language
	const translatePrompts = async () => {
		const translatedPrompts = await Promise.all(
			Object.values(prompts.en).map((prompt) =>
				translate.translateText(prompt, textLanguage)
			)
		);

		setPromptList({
			initialPrompt: translatedPrompts[0],
			startPart: translatedPrompts[1],
			endPart: translatedPrompts[2],
			startFinalPart: translatedPrompts[3],
			endFinalPart: translatedPrompts[4],
		});
	};

	// Calculate prompt lengths
	useEffect(() => {
		setPromptLengths(
			Object.values(promptList).map((prompt) => prompt?.length || 0)
		);
	}, [promptList]);

	const splitText = () => {
		const textLength = text.length;

		setIsResponseTooShort(textLength < chunkSize);

		const normalChunkSize =
			chunkSize - (promptLengths[1] + promptLengths[2]);
		const lastChunkSize = chunkSize - (promptLengths[3] + promptLengths[4]);
		const numChunks = Math.ceil(
			(textLength - lastChunkSize) / normalChunkSize
		);

		const textChunks: string[] = [promptList.initialPrompt];
		let start = 0;
		let end = normalChunkSize;

		for (let i = 0; i < numChunks; i++) {
			const chunk =
				promptList.startPart.replace(
					"001/002",
					`${String(i + 1).padStart(3, "0")}/${String(
						numChunks + 1
					).padStart(3, "0")}`
				) +
				text.substring(start, end) +
				promptList.endPart.replace(
					"001/002",
					`${String(i + 1).padStart(3, "0")}/${String(
						numChunks + 1
					).padStart(3, "0")}`
				);
			textChunks.push(chunk);
			start = end;
			end = start + normalChunkSize;
		}

		const finalChunk =
			promptList.startFinalPart.replace(
				"002/002",
				`${String(numChunks + 1).padStart(3, "0")}/${String(
					numChunks + 1
				).padStart(3, "0")}`
			) +
			text.substring(start, start + lastChunkSize) +
			promptList.endFinalPart.replace(
				"002/002",
				`${String(numChunks + 1).padStart(3, "0")}/${String(
					numChunks + 1
				).padStart(3, "0")}`
			);
		textChunks.push(finalChunk);

		setChunks(textChunks);
	};

	const languageOptions = [
		...languages.filter((language) =>
			["autodetect", "en", "es", "ca"].includes(language.code)
		),
		...languages.filter(
			(language) =>
				!["autodetect", "en", "es", "ca"].includes(language.code)
		),
	];

	return (
		<main className="container">
			<h1>ChatGPT 🤖 prompt Splitter</h1>
			<textarea
				placeholder="Enter text to split"
				value={text}
				onChange={(e) => setText(e.target.value)}
				onBlur={handleBlur}
				rows={10}
				cols={50}
			/>
			<div>
				<label htmlFor="languages">Choose a language:</label>
				<select
					id="languages"
					value={selectedLanguage}
					onChange={(e) => setSelectedLanguage(e.target.value)}
				>
					{languageOptions.map((lang, index) => (
						<option key={index} value={lang.code}>
							{lang.code === "autodetect"
								? `Auto Detect (${detectedLanguageName})`
								: lang.name}
						</option>
					))}
				</select>
			</div>
			<button onClick={splitText}>Split Text</button>
			{isResponseTooShort && (
				<h3>
					Text is too short to split! You could have sent as one
					chunk! 😂
				</h3>
			)}
			<div>
				{chunks.map((chunk, index) => (
					<CopyButton
						key={index}
						text={chunk}
						name={`Chunk ${index + 1}`}
					/>
				))}
			</div>
		</main>
	);
};

export default Splitter;
