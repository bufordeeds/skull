const fs = require('fs');
const path = require('path');
const https = require('https');

const fontsDir = path.join(__dirname, '../assets/fonts');

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
	fs.mkdirSync(fontsDir, { recursive: true });
}

// Font URLs from Google Fonts
const fonts = [
	{
		name: 'Cinzel-Regular.ttf',
		url: 'https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-tbnfYPlDX5Z.ttf'
	},
	{
		name: 'Cinzel-Bold.ttf',
		url: 'https://fonts.gstatic.com/s/cinzel/v23/8vIU7ww63mVu7gtR-kwKxNvkNOjw-lbsfYPlDX5Z.ttf'
	},
	{
		name: 'Montserrat-Regular.ttf',
		url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX8.ttf'
	},
	{
		name: 'Montserrat-Bold.ttf',
		url: 'https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX8.ttf'
	},
	{
		name: 'ShadowsIntoLight-Regular.ttf',
		url: 'https://fonts.gstatic.com/s/shadowsintolight/v15/UqyNK9UOIntux_czAvDQx_ZcHqZXBNQzdcD3.ttf'
	}
];

// Download each font
fonts.forEach((font) => {
	const filePath = path.join(fontsDir, font.name);

	// Skip if file already exists
	if (fs.existsSync(filePath)) {
		console.log(`${font.name} already exists, skipping...`);
		return;
	}

	console.log(`Downloading ${font.name}...`);

	const file = fs.createWriteStream(filePath);

	https
		.get(font.url, (response) => {
			response.pipe(file);

			file.on('finish', () => {
				file.close();
				console.log(`Downloaded ${font.name}`);
			});
		})
		.on('error', (err) => {
			fs.unlink(filePath, () => {}); // Delete the file if there's an error
			console.error(`Error downloading ${font.name}: ${err.message}`);
		});
});

console.log('Font download script completed.');
