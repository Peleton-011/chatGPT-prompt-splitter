import React from "react";

interface CopyButtonProps {
	text: string;
	name: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, name }) => {
	const [copied, setCopied] = React.useState(false);

	function copyToClipboard() {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				setCopied(true); // Reset copied state after 1.5 seconds
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
			});
	}

	return (
		<button
			onClick={copyToClipboard}
			className={"copy-button " + (copied ? "secondary" : "")}
		>
			{copied ? "Copied " + name + "!" : "Copy " + name}
		</button>
	);
};

export default CopyButton;
