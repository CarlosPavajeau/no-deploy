import { createServerFn } from "@tanstack/react-start";

export type Category = "keyboard" | "peripheral" | "audio" | "monitor";

export type ProductSpec = {
	label: string;
	value: string;
};

export type Product = {
	id: string;
	name: string;
	category: Category;
	price: number;
	description: string;
	longDescription: string;
	badge?: "New" | "Sale" | "Bestseller";
	rating: number;
	reviewCount: number;
	inStock: boolean;
	specs: ProductSpec[];
};

const PRODUCTS: Product[] = [
	// ── Keyboards ──────────────────────────────────────────────────
	{
		id: "kbd-001",
		name: "Meridian TKL Pro",
		category: "keyboard",
		price: 249,
		description:
			"Tenkeyless layout with a CNC-machined aluminum chassis and hot-swap PCB.",
		longDescription:
			"The Meridian TKL Pro is the culmination of precision engineering and premium materials. Built with a full CNC-machined aluminum case, it houses a hot-swap PCB that accepts both 3-pin and 5-pin switches. The gasket-mount design provides a satisfying typing feel with just the right amount of flex — firm enough for accuracy, forgiving enough for long sessions.",
		badge: "Bestseller",
		rating: 4.9,
		reviewCount: 847,
		inStock: true,
		specs: [
			{ label: "Layout", value: "TKL (87 key)" },
			{ label: "Case", value: "CNC Aluminum" },
			{ label: "Mounting", value: "Gasket Mount" },
			{ label: "PCB", value: "Hot-Swap, USB-C" },
			{ label: "Connectivity", value: "USB-C Wired" },
			{ label: "Backlight", value: "RGB Per-Key" },
			{ label: "Weight", value: "1.2 kg" },
		],
	},
	{
		id: "kbd-002",
		name: "Apex 60% Wireless",
		category: "keyboard",
		price: 189,
		description:
			"Ultra-compact 60% layout with tri-mode wireless connectivity.",
		longDescription:
			"The Apex 60% Wireless redefines what a small form factor keyboard can be. Supporting Bluetooth 5.0, 2.4 GHz wireless, and USB-C wired connections, it adapts to any workflow. The polycarbonate case delivers a unique acoustic profile that sounds as good as it types, while the 4000 mAh battery keeps you going for weeks.",
		badge: "New",
		rating: 4.7,
		reviewCount: 312,
		inStock: true,
		specs: [
			{ label: "Layout", value: "60% (61 key)" },
			{ label: "Case", value: "Polycarbonate" },
			{ label: "Mounting", value: "Top Mount" },
			{ label: "Connectivity", value: "BT 5.0 / 2.4 GHz / USB-C" },
			{ label: "Battery", value: "4000 mAh" },
			{ label: "Backlight", value: "RGB Per-Key" },
			{ label: "Weight", value: "780 g" },
		],
	},
	{
		id: "kbd-003",
		name: "Obsidian Full-Size",
		category: "keyboard",
		price: 179,
		description:
			"Full 104-key layout in a sleek matte anodized aluminum frame.",
		longDescription:
			"The Obsidian Full-Size brings the numpad back without compromise. Its matte anodized aluminum case pairs with a plate-mount PCB for a firm, precise typing experience favored by data-entry professionals and programmers alike. The triple-layer dampening foam eliminates unwanted resonance for a clean, thocky sound profile.",
		rating: 4.6,
		reviewCount: 524,
		inStock: true,
		specs: [
			{ label: "Layout", value: "Full Size (104 key)" },
			{ label: "Case", value: "Anodized Aluminum" },
			{ label: "Mounting", value: "Plate Mount" },
			{ label: "PCB", value: "USB-C Detachable" },
			{ label: "Connectivity", value: "USB-C Wired" },
			{ label: "Backlight", value: "RGB Per-Key" },
			{ label: "Weight", value: "1.4 kg" },
		],
	},

	// ── Peripherals ────────────────────────────────────────────────
	{
		id: "mse-001",
		name: "Precision Pro X",
		category: "peripheral",
		price: 129,
		description:
			"25,600 DPI optical sensor in an ergonomic right-hand sculpt with adjustable weight.",
		longDescription:
			"Engineered for precision, the Precision Pro X packs a 25,600 DPI optical sensor into an ergonomic right-hand form factor. The textured side grips and adjustable weight system let you tune it to your exact preference. Seven programmable buttons and a 1000 Hz polling rate give you a competitive edge in any application.",
		badge: "Bestseller",
		rating: 4.8,
		reviewCount: 1203,
		inStock: true,
		specs: [
			{ label: "Sensor", value: "25,600 DPI Optical" },
			{ label: "Polling Rate", value: "1000 Hz" },
			{ label: "Buttons", value: "7 (Programmable)" },
			{ label: "Connectivity", value: "USB-A Wired" },
			{ label: "Grip Style", value: "Ergonomic (Right)" },
			{ label: "Weight", value: "95 g (adjustable)" },
			{ label: "Cable", value: "Braided, 1.8 m" },
		],
	},
	{
		id: "mse-002",
		name: "Stealth Wireless",
		category: "peripheral",
		price: 79,
		description:
			"2.4 GHz wireless mouse with 70-hour battery and 95% quieter clicks.",
		longDescription:
			"The Stealth Wireless is your go-to for silent productivity. Silent-click switches reduce noise by 95% while 2.4 GHz wireless delivers a lag-free experience. 70 hours of battery life on a single charge keeps you untethered for weeks, and the USB-C charging port means no proprietary cables.",
		badge: "Sale",
		rating: 4.5,
		reviewCount: 678,
		inStock: true,
		specs: [
			{ label: "Sensor", value: "16,000 DPI Optical" },
			{ label: "Polling Rate", value: "125 Hz" },
			{ label: "Buttons", value: "5 (Programmable)" },
			{ label: "Connectivity", value: "2.4 GHz / USB-C" },
			{ label: "Battery", value: "70 hours" },
			{ label: "Weight", value: "88 g" },
			{ label: "Cable", value: "USB-C Charging" },
		],
	},
	{
		id: "mse-003",
		name: "Ergo Plus V2",
		category: "peripheral",
		price: 149,
		description:
			"Vertical ergonomic design that reduces forearm strain during marathon sessions.",
		longDescription:
			"The Ergo Plus V2 promotes a natural handshake grip position, reducing forearm pronation and strain by up to 60%. With a premium optical sensor and programmable thumb buttons, it delivers both comfort and performance. The braided cable is soft and flexible, staying out of the way even during intense use.",
		badge: "New",
		rating: 4.6,
		reviewCount: 289,
		inStock: true,
		specs: [
			{ label: "Sensor", value: "16,000 DPI Optical" },
			{ label: "Polling Rate", value: "1000 Hz" },
			{ label: "Buttons", value: "5 (Programmable)" },
			{ label: "Connectivity", value: "USB-C Wired" },
			{ label: "Grip Style", value: "Vertical Ergonomic" },
			{ label: "Weight", value: "128 g" },
			{ label: "Cable", value: "Braided, 1.8 m" },
		],
	},

	// ── Audio ──────────────────────────────────────────────────────
	{
		id: "aud-001",
		name: "Studio Monitor MK2",
		category: "audio",
		price: 299,
		description:
			"Open-back studio headphones with flat frequency response for accurate monitoring.",
		longDescription:
			"The Studio Monitor MK2 delivers studio-grade accuracy in an open-back design. The flat frequency response ensures what you hear is exactly what is in the recording — critical for mixing, mastering, and serious listening. The velour earpads and self-adjusting headband allow for extended wear without fatigue.",
		rating: 4.9,
		reviewCount: 432,
		inStock: true,
		specs: [
			{ label: "Type", value: "Open-Back, Over-Ear" },
			{ label: "Driver", value: "50 mm Dynamic" },
			{ label: "Impedance", value: "250 Ohm" },
			{ label: "Frequency", value: "5 Hz – 35 kHz" },
			{ label: "Connectivity", value: "3.5 mm / 6.35 mm" },
			{ label: "Cable", value: "Coiled, 3 m" },
			{ label: "Weight", value: "270 g" },
		],
	},
	{
		id: "aud-002",
		name: "Void Wireless Headset",
		category: "audio",
		price: 199,
		description:
			"2.4 GHz wireless headset with 30-hour battery and virtual 7.1 surround sound.",
		longDescription:
			"The Void Wireless Headset combines immersive 7.1 surround sound with an ultra-long wireless range of up to 15 meters. Its memory foam earcups with mesh fabric and adjustable headband ensure comfort during the longest sessions. The detachable boom microphone delivers clear voice communication with noise cancellation.",
		badge: "Bestseller",
		rating: 4.7,
		reviewCount: 956,
		inStock: true,
		specs: [
			{ label: "Type", value: "Closed-Back, Over-Ear" },
			{ label: "Driver", value: "50 mm Custom" },
			{ label: "Surround", value: "7.1 Virtual" },
			{ label: "Connectivity", value: "2.4 GHz / USB-A" },
			{ label: "Battery", value: "30 hours" },
			{ label: "Microphone", value: "Unidirectional, Detachable" },
			{ label: "Weight", value: "340 g" },
		],
	},
	{
		id: "aud-003",
		name: "Compact Speaker Array",
		category: "audio",
		price: 159,
		description:
			"USB-powered stereo desktop speakers with a 24-bit DAC and touch volume control.",
		longDescription:
			"The Compact Speaker Array delivers rich stereo sound from a minimal footprint. USB bus-powered with a built-in 24-bit / 96 kHz DAC, it needs no external power supply or amplifier. Touch-sensitive volume control and passive radiators produce surprising bass depth from a form factor small enough to hide behind a monitor.",
		badge: "New",
		rating: 4.5,
		reviewCount: 187,
		inStock: true,
		specs: [
			{ label: "Type", value: "Active Stereo" },
			{ label: "Drivers", value: '2 × 2.5" + 2 Passive Radiators' },
			{ label: "Power", value: "USB Bus-Powered" },
			{ label: "Connectivity", value: "USB / 3.5 mm / Optical" },
			{ label: "DAC", value: "24-bit / 96 kHz" },
			{ label: "Controls", value: "Touch Volume" },
			{ label: "Weight", value: "1.1 kg" },
		],
	},

	// ── Monitors ───────────────────────────────────────────────────
	{
		id: "mon-001",
		name: 'Luminary 27" 4K',
		category: "monitor",
		price: 799,
		description:
			"27-inch IPS 4K panel with factory calibration and wide color gamut.",
		longDescription:
			'The Luminary 27" 4K is designed for professionals who demand color accuracy. Each panel is factory-calibrated to achieve ΔE < 2 across the sRGB and DCI-P3 color gamuts. The ergonomic stand provides height, tilt, swivel, and pivot adjustments so you can dial in the perfect working position.',
		badge: "New",
		rating: 4.8,
		reviewCount: 341,
		inStock: true,
		specs: [
			{ label: "Size", value: '27" IPS' },
			{ label: "Resolution", value: "3840 × 2160 (4K)" },
			{ label: "Refresh Rate", value: "60 Hz" },
			{ label: "Color Gamut", value: "99% sRGB / 95% DCI-P3" },
			{ label: "Inputs", value: "2× HDMI 2.1, 1× DP 1.4, USB-C" },
			{ label: "Response Time", value: "4 ms (GtG)" },
			{ label: "Brightness", value: "350 nits" },
		],
	},
	{
		id: "mon-002",
		name: 'Slate 32" OLED',
		category: "monitor",
		price: 1299,
		description:
			"32-inch QHD OLED panel delivering true blacks and a 240 Hz refresh rate.",
		longDescription:
			'The Slate 32" OLED pushes the limits of display technology. OLED delivers infinite contrast ratio with true blacks, while the 240 Hz refresh rate ensures buttery-smooth motion. A 0.03 ms response time and HDMI 2.1 inputs make it equally suited for creative work and high-performance use.',
		rating: 4.9,
		reviewCount: 198,
		inStock: false,
		specs: [
			{ label: "Size", value: '32" OLED' },
			{ label: "Resolution", value: "2560 × 1440 (QHD)" },
			{ label: "Refresh Rate", value: "240 Hz" },
			{ label: "Contrast", value: "1,000,000:1 (OLED)" },
			{ label: "Inputs", value: "2× HDMI 2.1, 1× DP 2.1, USB-C" },
			{ label: "Response Time", value: "0.03 ms" },
			{ label: "Brightness", value: "1000 nits (peak)" },
		],
	},
	{
		id: "mon-003",
		name: 'Axis 24" 144 Hz',
		category: "monitor",
		price: 399,
		description:
			"24-inch 1080p fast IPS panel with 144 Hz refresh and G-Sync compatibility.",
		longDescription:
			'The Axis 24" 144 Hz is built for competitive performance. The fast IPS panel combines a 144 Hz refresh rate with a 1 ms response time and NVIDIA G-Sync compatibility to eliminate screen tearing. The compact 24-inch footprint is ideal for tight desk setups or multi-monitor arrays.',
		badge: "Bestseller",
		rating: 4.7,
		reviewCount: 892,
		inStock: true,
		specs: [
			{ label: "Size", value: '24" Fast IPS' },
			{ label: "Resolution", value: "1920 × 1080 (FHD)" },
			{ label: "Refresh Rate", value: "144 Hz" },
			{ label: "Sync", value: "G-Sync Compatible / FreeSync" },
			{ label: "Inputs", value: "2× HDMI 2.0, 1× DP 1.4" },
			{ label: "Response Time", value: "1 ms (GtG)" },
			{ label: "Brightness", value: "400 nits" },
		],
	},
];

export const getProducts = createServerFn({ method: "GET" }).handler(() => {
	return PRODUCTS;
});

export const getProduct = createServerFn({ method: "GET" })
	.inputValidator((productId: unknown) => {
		if (typeof productId !== "string") throw new Error("Invalid product ID");
		return productId;
	})
	.handler(({ data: productId }) => {
		const product = PRODUCTS.find((p) => p.id === productId);
		if (!product) throw new Error(`Product not found: ${productId}`);
		return product;
	});
