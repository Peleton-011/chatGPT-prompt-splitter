import { useState } from "react";

const Splitter = () => {
	const [text, setText] = useState<string>("");
	const [chunks, setChunks] = useState<string[]>([]);

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

	const handleTextChange = (
		event: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		setText(event.target.value);
	};

	const handleSplit = () => {
		splitText(text);
	};

	return (
		<div>
			<textarea
				placeholder="Enter text to split"
				value={text}
				onChange={handleTextChange}
				rows={10}
				cols={50}
			/>
			<button onClick={handleSplit}>Split Text</button>
			<div>
				{chunks.map((chunk: string, index: number) => (
					<div key={index}>
						<h3>Chunk {index + 1}</h3>
						<p>{chunk}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default Splitter;
