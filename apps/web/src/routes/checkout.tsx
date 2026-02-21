import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import {
	Building2,
	ChevronLeft,
	CreditCard,
	Lock,
	MapPin,
	Smartphone,
	Wallet,
} from "lucide-react";
import { useState } from "react";

import { PRODUCT_IMAGE_URL } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select";
import { useCart } from "@/hooks/use-cart";
import { saveOrder } from "@/lib/order";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
	component: CheckoutPage,
});

// ── Types ────────────────────────────────────────────────────────────

type BillingData = {
	fullName: string;
	email: string;
	phone: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	zip: string;
	country: string;
};

type PaymentMethod = "card" | "pse" | "nequi" | "bancolombia";

type CardData = {
	cardName: string;
	cardNumber: string;
	expiry: string;
	cvv: string;
	saveCard: boolean;
};

type PSEData = {
	personType: string;
	bank: string;
	docType: string;
	docNumber: string;
	email: string;
};

type NequiData = {
	phone: string;
};

type BancolombiaData = {
	personType: string;
	docType: string;
	docNumber: string;
};

type FormErrors<T> = Partial<Record<keyof T, string>>;

// ── Constants ────────────────────────────────────────────────────────

const SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;
const TAX_RATE = 0.08;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EXPIRY_RE = /^(0[1-9]|1[0-2])\/\d{2}$/;

const COUNTRIES = [
	"Colombia",
	"United States",
	"Canada",
	"United Kingdom",
	"Australia",
	"Germany",
	"France",
	"Netherlands",
	"Sweden",
	"Norway",
	"Denmark",
	"Switzerland",
	"Japan",
	"South Korea",
	"Singapore",
	"New Zealand",
	"Ireland",
	"Austria",
	"Belgium",
	"Spain",
	"Italy",
] as const;

const PSE_BANKS = [
	"Bancolombia",
	"Banco de Bogotá",
	"Davivienda",
	"BBVA Colombia",
	"Banco Popular",
	"AV Villas",
	"Banco de Occidente",
	"Banco Caja Social",
	"Scotiabank Colpatria",
	"GNB Sudameris",
	"Banco Agrario",
	"Coopcentral",
	"Banco Falabella",
	"Banco Pichincha",
	"Banco W",
] as const;

const CO_DOC_TYPES = [
	{ value: "CC", label: "Cédula de Ciudadanía (CC)" },
	{ value: "CE", label: "Cédula de Extranjería (CE)" },
	{ value: "TI", label: "Tarjeta de Identidad (TI)" },
	{ value: "PP", label: "Pasaporte (PP)" },
	{ value: "NIT", label: "NIT (empresa)" },
] as const;

const PAYMENT_METHODS: {
	id: PaymentMethod;
	label: string;
	sublabel: string;
	Icon: React.ElementType;
	accent: string;
}[] = [
	{
		id: "card",
		label: "Tarjeta",
		sublabel: "Crédito / débito",
		Icon: CreditCard,
		accent: "text-blue-500",
	},
	{
		id: "pse",
		label: "PSE",
		sublabel: "Débito bancario",
		Icon: Building2,
		accent: "text-violet-500",
	},
	{
		id: "nequi",
		label: "Nequi",
		sublabel: "Pago desde la app",
		Icon: Smartphone,
		accent: "text-pink-500",
	},
	{
		id: "bancolombia",
		label: "Bancolombia",
		sublabel: "Botón de pago",
		Icon: Wallet,
		accent: "text-yellow-500",
	},
];

// ── Formatting helpers ───────────────────────────────────────────────

function formatCardNumber(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 16);
	return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(raw: string): string {
	const digits = raw.replace(/\D/g, "").slice(0, 4);
	if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
	return digits;
}

// ── Validation ───────────────────────────────────────────────────────

function validateBilling(data: BillingData): FormErrors<BillingData> {
	const errors: FormErrors<BillingData> = {};
	if (!data.fullName.trim()) errors.fullName = "Full name is required";
	if (!data.email.trim()) errors.email = "Email is required";
	else if (!EMAIL_RE.test(data.email))
		errors.email = "Enter a valid email address";
	if (!data.address1.trim()) errors.address1 = "Address is required";
	if (!data.city.trim()) errors.city = "City is required";
	if (!data.state.trim()) errors.state = "State / Province is required";
	if (!data.zip.trim()) errors.zip = "Postal code is required";
	if (!data.country) errors.country = "Country is required";
	return errors;
}

function validateCard(d: CardData): FormErrors<CardData> {
	const errors: FormErrors<CardData> = {};
	if (!d.cardName.trim()) errors.cardName = "Cardholder name is required";
	const digits = d.cardNumber.replace(/\s/g, "");
	if (!digits) errors.cardNumber = "Card number is required";
	else if (digits.length !== 16)
		errors.cardNumber = "Enter a 16-digit card number";
	if (!d.expiry) errors.expiry = "Expiry date is required";
	else if (!EXPIRY_RE.test(d.expiry)) errors.expiry = "Use MM/YY format";
	if (!d.cvv) errors.cvv = "CVV is required";
	else if (!/^\d{3,4}$/.test(d.cvv)) errors.cvv = "Enter a 3- or 4-digit CVV";
	return errors;
}

function validatePSE(d: PSEData): FormErrors<PSEData> {
	const errors: FormErrors<PSEData> = {};
	if (!d.personType) errors.personType = "Selecciona el tipo de persona";
	if (!d.bank) errors.bank = "Selecciona tu banco";
	if (!d.docType) errors.docType = "Selecciona el tipo de documento";
	if (!d.docNumber.trim()) errors.docNumber = "Número de documento requerido";
	if (!d.email.trim()) errors.email = "El correo es requerido";
	else if (!EMAIL_RE.test(d.email))
		errors.email = "Ingresa un correo electrónico válido";
	return errors;
}

function validateNequi(d: NequiData): FormErrors<NequiData> {
	const errors: FormErrors<NequiData> = {};
	const digits = d.phone.replace(/\D/g, "");
	if (!digits) errors.phone = "Número de celular requerido";
	else if (digits.length !== 10)
		errors.phone = "Ingresa los 10 dígitos del celular";
	else if (!digits.startsWith("3"))
		errors.phone = "Debe ser un celular colombiano que empiece por 3";
	return errors;
}

function validateBancolombia(d: BancolombiaData): FormErrors<BancolombiaData> {
	const errors: FormErrors<BancolombiaData> = {};
	if (!d.personType) errors.personType = "Selecciona el tipo de persona";
	if (!d.docType) errors.docType = "Selecciona el tipo de documento";
	if (!d.docNumber.trim()) errors.docNumber = "Número de documento requerido";
	return errors;
}

// ── Shared sub-components ─────────────────────────────────────────────

function FormField({
	id,
	label,
	error,
	required,
	children,
}: {
	id: string;
	label: string;
	error?: string;
	required?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-sm font-medium leading-none">
				{label}
				{required && (
					<span aria-hidden className="ml-0.5 text-destructive">
						*
					</span>
				)}
			</label>
			{children}
			{error && (
				<p role="alert" className="text-xs text-destructive">
					{error}
				</p>
			)}
		</div>
	);
}

function StepIndicator({ step }: { step: 1 | 2 }) {
	return (
		<div className="flex items-center gap-3">
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex size-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
						step === 1
							? "bg-foreground text-background"
							: "bg-emerald-500 text-white",
					)}
				>
					{step > 1 ? "✓" : "1"}
				</div>
				<span
					className={cn(
						"hidden text-sm font-medium sm:block",
						step === 1 ? "text-foreground" : "text-muted-foreground",
					)}
				>
					Billing Address
				</span>
			</div>

			<div
				className={cn(
					"h-px w-10 rounded-full transition-colors",
					step === 2 ? "bg-emerald-500" : "bg-border",
				)}
			/>

			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex size-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors",
						step === 2
							? "bg-foreground text-background"
							: "border border-border text-muted-foreground",
					)}
				>
					2
				</div>
				<span
					className={cn(
						"hidden text-sm font-medium sm:block",
						step === 2 ? "text-foreground" : "text-muted-foreground",
					)}
				>
					Payment
				</span>
			</div>
		</div>
	);
}

function OrderSummary({
	subtotal,
	shipping,
	tax,
	total,
}: {
	subtotal: number;
	shipping: number;
	tax: number;
	total: number;
}) {
	const { items } = useCart();

	return (
		<div className="rounded-2xl border border-border bg-card p-5">
			<p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
				Order Summary
			</p>

			<div className="mb-4 flex flex-wrap gap-2">
				{items.map((item) => (
					<div key={item.productId} className="relative">
						<div className="size-10 overflow-hidden rounded-lg bg-muted">
							<Image
								src={PRODUCT_IMAGE_URL}
								alt={item.name}
								layout="fixed"
								width={40}
								height={40}
								className="object-cover"
							/>
						</div>
						{item.quantity > 1 && (
							<span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-foreground font-mono text-[9px] font-bold text-background">
								{item.quantity}
							</span>
						)}
					</div>
				))}
			</div>

			<div className="flex flex-col gap-1.5 text-sm">
				{items.map((item) => (
					<div
						key={item.productId}
						className="flex items-start justify-between gap-2"
					>
						<span className="truncate text-muted-foreground">
							{item.name}
							{item.quantity > 1 && (
								<span className="ml-1 font-mono text-xs">×{item.quantity}</span>
							)}
						</span>
						<span className="shrink-0 font-medium tabular-nums">
							${(item.price * item.quantity).toFixed(2)}
						</span>
					</div>
				))}
			</div>

			<div className="my-4 h-px bg-border" />

			<div className="flex flex-col gap-2 text-sm">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Subtotal</span>
					<span className="font-medium tabular-nums">
						${subtotal.toFixed(2)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Shipping</span>
					<span className="font-medium tabular-nums">
						{shipping === 0 ? (
							<span className="text-emerald-500">Free</span>
						) : (
							`$${shipping.toFixed(2)}`
						)}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-muted-foreground">Tax (8%)</span>
					<span className="font-medium tabular-nums">${tax.toFixed(2)}</span>
				</div>
				<div className="my-1 h-px bg-border" />
				<div className="flex justify-between text-base font-bold">
					<span>Total</span>
					<span className="tabular-nums">${total.toFixed(2)}</span>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2">
				<Lock className="size-3 shrink-0 text-muted-foreground" />
				<p className="font-mono text-[10px] text-muted-foreground">
					Secured with 256-bit SSL encryption
				</p>
			</div>
		</div>
	);
}

// ── Payment method sub-forms ──────────────────────────────────────────

function CardForm({
	data,
	errors,
	setField,
}: {
	data: CardData;
	errors: FormErrors<CardData>;
	setField: <K extends keyof CardData>(key: K, value: CardData[K]) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<FormField
				id="cardName"
				label="Cardholder Name"
				error={errors.cardName}
				required
			>
				<Input
					id="cardName"
					autoComplete="cc-name"
					placeholder="Jane Smith"
					value={data.cardName}
					onChange={(e) => setField("cardName", e.target.value)}
					aria-invalid={!!errors.cardName}
					className="h-10 rounded-xl"
				/>
			</FormField>

			<FormField
				id="cardNumber"
				label="Card Number"
				error={errors.cardNumber}
				required
			>
				<div className="relative">
					<Input
						id="cardNumber"
						autoComplete="cc-number"
						inputMode="numeric"
						placeholder="1234 5678 9012 3456"
						value={data.cardNumber}
						onChange={(e) =>
							setField("cardNumber", formatCardNumber(e.target.value))
						}
						aria-invalid={!!errors.cardNumber}
						className="h-10 rounded-xl pr-12 font-mono tracking-wider"
					/>
					<CreditCard className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				</div>
			</FormField>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					id="expiry"
					label="Expiry Date"
					error={errors.expiry}
					required
				>
					<Input
						id="expiry"
						autoComplete="cc-exp"
						inputMode="numeric"
						placeholder="MM/YY"
						value={data.expiry}
						onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
						aria-invalid={!!errors.expiry}
						className="h-10 rounded-xl font-mono"
					/>
				</FormField>
				<FormField id="cvv" label="CVV" error={errors.cvv} required>
					<Input
						id="cvv"
						autoComplete="cc-csc"
						inputMode="numeric"
						placeholder="123"
						maxLength={4}
						value={data.cvv}
						onChange={(e) =>
							setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
						}
						aria-invalid={!!errors.cvv}
						className="h-10 rounded-xl font-mono"
					/>
				</FormField>
			</div>

			<label
				htmlFor="saveCard"
				className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4"
			>
				<Checkbox
					id="saveCard"
					checked={data.saveCard}
					onCheckedChange={(checked) => setField("saveCard", checked === true)}
				/>
				<div>
					<p className="text-sm font-medium">Save payment information</p>
					<p className="text-xs text-muted-foreground">
						Securely store this card for future purchases.
					</p>
				</div>
			</label>
		</div>
	);
}

function PSEForm({
	data,
	errors,
	setField,
}: {
	data: PSEData;
	errors: FormErrors<PSEData>;
	setField: <K extends keyof PSEData>(key: K, value: PSEData[K]) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3">
				<p className="text-xs text-muted-foreground">
					Serás redirigido a tu banco para completar el pago de forma segura a
					través de PSE.
				</p>
			</div>

			<FormField
				id="pse-person-type"
				label="Tipo de persona"
				error={errors.personType}
				required
			>
				<NativeSelect
					id="pse-person-type"
					value={data.personType}
					onChange={(e) => setField("personType", e.target.value)}
					aria-invalid={!!errors.personType}
					className="w-full"
				>
					<NativeSelectOption value="" disabled>
						Selecciona…
					</NativeSelectOption>
					<NativeSelectOption value="natural">
						Persona Natural
					</NativeSelectOption>
					<NativeSelectOption value="juridica">
						Persona Jurídica
					</NativeSelectOption>
				</NativeSelect>
			</FormField>

			<FormField id="pse-bank" label="Banco" error={errors.bank} required>
				<NativeSelect
					id="pse-bank"
					value={data.bank}
					onChange={(e) => setField("bank", e.target.value)}
					aria-invalid={!!errors.bank}
					className="w-full"
				>
					<NativeSelectOption value="" disabled>
						Selecciona tu banco…
					</NativeSelectOption>
					{PSE_BANKS.map((b) => (
						<NativeSelectOption key={b} value={b}>
							{b}
						</NativeSelectOption>
					))}
				</NativeSelect>
			</FormField>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					id="pse-doc-type"
					label="Tipo de documento"
					error={errors.docType}
					required
				>
					<NativeSelect
						id="pse-doc-type"
						value={data.docType}
						onChange={(e) => setField("docType", e.target.value)}
						aria-invalid={!!errors.docType}
						className="w-full"
					>
						<NativeSelectOption value="" disabled>
							Selecciona…
						</NativeSelectOption>
						{CO_DOC_TYPES.map((d) => (
							<NativeSelectOption key={d.value} value={d.value}>
								{d.label}
							</NativeSelectOption>
						))}
					</NativeSelect>
				</FormField>

				<FormField
					id="pse-doc-number"
					label="Número de documento"
					error={errors.docNumber}
					required
				>
					<Input
						id="pse-doc-number"
						inputMode="numeric"
						placeholder="1234567890"
						value={data.docNumber}
						onChange={(e) =>
							setField("docNumber", e.target.value.replace(/\D/g, ""))
						}
						aria-invalid={!!errors.docNumber}
						className="h-10 rounded-xl font-mono"
					/>
				</FormField>
			</div>

			<FormField
				id="pse-email"
				label="Correo electrónico"
				error={errors.email}
				required
			>
				<Input
					id="pse-email"
					type="email"
					autoComplete="email"
					placeholder="correo@ejemplo.com"
					value={data.email}
					onChange={(e) => setField("email", e.target.value)}
					aria-invalid={!!errors.email}
					className="h-10 rounded-xl"
				/>
			</FormField>
		</div>
	);
}

function NequiForm({
	data,
	errors,
	setField,
}: {
	data: NequiData;
	errors: FormErrors<NequiData>;
	setField: <K extends keyof NequiData>(key: K, value: NequiData[K]) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-xl border border-pink-500/20 bg-pink-500/5 px-4 py-3">
				<p className="text-xs text-muted-foreground">
					Ingresa el celular vinculado a tu cuenta Nequi. Recibirás una
					notificación push para aprobar el pago.
				</p>
			</div>

			<FormField
				id="nequi-phone"
				label="Número de celular Nequi"
				error={errors.phone}
				required
			>
				<div className="relative">
					<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
						+57
					</span>
					<Input
						id="nequi-phone"
						type="tel"
						inputMode="numeric"
						placeholder="300 000 0000"
						value={data.phone}
						onChange={(e) =>
							setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
						}
						aria-invalid={!!errors.phone}
						className="h-10 rounded-xl pl-12 font-mono tracking-wider"
					/>
					<Smartphone className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				</div>
			</FormField>
		</div>
	);
}

function BancolombiaForm({
	data,
	errors,
	setField,
}: {
	data: BancolombiaData;
	errors: FormErrors<BancolombiaData>;
	setField: <K extends keyof BancolombiaData>(
		key: K,
		value: BancolombiaData[K],
	) => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
				<p className="text-xs text-muted-foreground">
					Serás redirigido al portal de Bancolombia para completar el pago con
					tu cuenta de ahorros o corriente.
				</p>
			</div>

			<FormField
				id="bc-person-type"
				label="Tipo de persona"
				error={errors.personType}
				required
			>
				<NativeSelect
					id="bc-person-type"
					value={data.personType}
					onChange={(e) => setField("personType", e.target.value)}
					aria-invalid={!!errors.personType}
					className="w-full"
				>
					<NativeSelectOption value="" disabled>
						Selecciona…
					</NativeSelectOption>
					<NativeSelectOption value="natural">
						Persona Natural
					</NativeSelectOption>
					<NativeSelectOption value="juridica">
						Persona Jurídica
					</NativeSelectOption>
				</NativeSelect>
			</FormField>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					id="bc-doc-type"
					label="Tipo de documento"
					error={errors.docType}
					required
				>
					<NativeSelect
						id="bc-doc-type"
						value={data.docType}
						onChange={(e) => setField("docType", e.target.value)}
						aria-invalid={!!errors.docType}
						className="w-full"
					>
						<NativeSelectOption value="" disabled>
							Selecciona…
						</NativeSelectOption>
						{CO_DOC_TYPES.map((d) => (
							<NativeSelectOption key={d.value} value={d.value}>
								{d.label}
							</NativeSelectOption>
						))}
					</NativeSelect>
				</FormField>

				<FormField
					id="bc-doc-number"
					label="Número de documento"
					error={errors.docNumber}
					required
				>
					<Input
						id="bc-doc-number"
						inputMode="numeric"
						placeholder="1234567890"
						value={data.docNumber}
						onChange={(e) =>
							setField("docNumber", e.target.value.replace(/\D/g, ""))
						}
						aria-invalid={!!errors.docNumber}
						className="h-10 rounded-xl font-mono"
					/>
				</FormField>
			</div>
		</div>
	);
}

// ── Main component ───────────────────────────────────────────────────

function CheckoutPage() {
	const { items, clearCart, subtotal } = useCart();
	const navigate = useNavigate();

	const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
	const tax = subtotal * TAX_RATE;
	const total = subtotal + shipping + tax;

	const [step, setStep] = useState<1 | 2>(1);

	const [billing, setBilling] = useState<BillingData>({
		fullName: "",
		email: "",
		phone: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zip: "",
		country: "",
	});

	const [billingErrors, setBillingErrors] = useState<FormErrors<BillingData>>(
		{},
	);

	if (items.length === 0) {
		return (
			<div className="h-full overflow-y-auto">
				<div className="flex h-full flex-col items-center justify-center gap-4 text-center">
					<p className="text-sm text-muted-foreground">Your cart is empty.</p>
					<Link
						to="/products"
						className="font-mono text-xs text-muted-foreground hover:text-foreground"
					>
						← Browse products
					</Link>
				</div>
			</div>
		);
	}

	function handleContinue() {
		const errors = validateBilling(billing);
		if (Object.keys(errors).length > 0) {
			setBillingErrors(errors);
			return;
		}
		setBillingErrors({});
		setStep(2);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function handlePlaceOrder() {
		const orderId = `ARCH-${Math.floor(100000 + Math.random() * 900000).toString()}`;
		saveOrder({
			number: orderId,
			email: billing.email,
			items: [...items],
			subtotal,
			shipping,
			tax,
			total,
		});
		clearCart();
		navigate({ to: "/order/$orderId", params: { orderId } });
	}

	function setBillingField<K extends keyof BillingData>(
		key: K,
		value: BillingData[K],
	) {
		setBilling((prev) => ({ ...prev, [key]: value }));
		if (billingErrors[key])
			setBillingErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	return (
		<div className="h-full overflow-y-auto">
			<div className="border-b border-border">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
					<div>
						<p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
							Checkout
						</p>
						<StepIndicator step={step} />
					</div>
					<Link
						to="/cart"
						className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<ChevronLeft className="size-3.5" />
						Back to cart
					</Link>
				</div>
			</div>

			<div className="mx-auto max-w-6xl px-6 py-10">
				<div className="grid gap-10 lg:grid-cols-[1fr_360px]">
					<div>
						{step === 1 ? (
							<BillingForm
								data={billing}
								errors={billingErrors}
								setField={setBillingField}
								onContinue={handleContinue}
							/>
						) : (
							<PaymentForm
								onBack={() => setStep(1)}
								onPlaceOrder={handlePlaceOrder}
								billing={billing}
								total={total}
							/>
						)}
					</div>

					<div className="h-fit lg:sticky lg:top-4">
						<OrderSummary
							subtotal={subtotal}
							shipping={shipping}
							tax={tax}
							total={total}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// ── Step 1: Billing Address ──────────────────────────────────────────

function BillingForm({
	data,
	errors,
	setField,
	onContinue,
}: {
	data: BillingData;
	errors: FormErrors<BillingData>;
	setField: <K extends keyof BillingData>(
		key: K,
		value: BillingData[K],
	) => void;
	onContinue: () => void;
}) {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<MapPin className="size-4 text-muted-foreground" />
				<h2 className="text-xl font-bold tracking-tight">Billing Address</h2>
			</div>

			<div className="flex flex-col gap-4">
				<FormField
					id="fullName"
					label="Full Name"
					error={errors.fullName}
					required
				>
					<Input
						id="fullName"
						autoComplete="name"
						placeholder="Jane Smith"
						value={data.fullName}
						onChange={(e) => setField("fullName", e.target.value)}
						aria-invalid={!!errors.fullName}
						className="h-10 rounded-xl"
					/>
				</FormField>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField id="email" label="Email" error={errors.email} required>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="jane@example.com"
							value={data.email}
							onChange={(e) => setField("email", e.target.value)}
							aria-invalid={!!errors.email}
							className="h-10 rounded-xl"
						/>
					</FormField>
					<FormField id="phone" label="Phone" error={errors.phone}>
						<Input
							id="phone"
							type="tel"
							autoComplete="tel"
							placeholder="+57 300 000 0000"
							value={data.phone}
							onChange={(e) => setField("phone", e.target.value)}
							className="h-10 rounded-xl"
						/>
					</FormField>
				</div>

				<FormField
					id="address1"
					label="Address"
					error={errors.address1}
					required
				>
					<Input
						id="address1"
						autoComplete="address-line1"
						placeholder="Cra 7 #32-16"
						value={data.address1}
						onChange={(e) => setField("address1", e.target.value)}
						aria-invalid={!!errors.address1}
						className="h-10 rounded-xl"
					/>
				</FormField>

				<FormField id="address2" label="Apartment, suite, etc.">
					<Input
						id="address2"
						autoComplete="address-line2"
						placeholder="Apto 301 (opcional)"
						value={data.address2}
						onChange={(e) => setField("address2", e.target.value)}
						className="h-10 rounded-xl"
					/>
				</FormField>

				<div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
					<FormField id="city" label="City" error={errors.city} required>
						<Input
							id="city"
							autoComplete="address-level2"
							placeholder="Bogotá"
							value={data.city}
							onChange={(e) => setField("city", e.target.value)}
							aria-invalid={!!errors.city}
							className="h-10 rounded-xl"
						/>
					</FormField>
					<FormField
						id="state"
						label="State / Province"
						error={errors.state}
						required
					>
						<Input
							id="state"
							autoComplete="address-level1"
							placeholder="Cundinamarca"
							value={data.state}
							onChange={(e) => setField("state", e.target.value)}
							aria-invalid={!!errors.state}
							className="h-10 rounded-xl"
						/>
					</FormField>
					<FormField id="zip" label="ZIP / Postal" error={errors.zip} required>
						<Input
							id="zip"
							autoComplete="postal-code"
							placeholder="110111"
							value={data.zip}
							onChange={(e) => setField("zip", e.target.value)}
							aria-invalid={!!errors.zip}
							className="h-10 w-28 rounded-xl"
						/>
					</FormField>
				</div>

				<FormField id="country" label="Country" error={errors.country} required>
					<NativeSelect
						id="country"
						value={data.country}
						onChange={(e) => setField("country", e.target.value)}
						aria-invalid={!!errors.country}
						className="w-full"
					>
						<NativeSelectOption value="" disabled>
							Select country…
						</NativeSelectOption>
						{COUNTRIES.map((c) => (
							<NativeSelectOption key={c} value={c}>
								{c}
							</NativeSelectOption>
						))}
					</NativeSelect>
				</FormField>
			</div>

			<Button
				type="button"
				onClick={onContinue}
				className="h-11 w-full rounded-xl text-sm font-semibold sm:w-auto sm:min-w-48"
			>
				Continue to Payment →
			</Button>
		</div>
	);
}

// ── Step 2: Payment ───────────────────────────────────────────────────

function PaymentForm({
	onBack,
	onPlaceOrder,
	billing,
	total,
}: {
	onBack: () => void;
	onPlaceOrder: () => void;
	billing: BillingData;
	total: number;
}) {
	const [method, setMethod] = useState<PaymentMethod>("card");

	const [card, setCardData] = useState<CardData>({
		cardName: "",
		cardNumber: "",
		expiry: "",
		cvv: "",
		saveCard: false,
	});
	const [pse, setPseData] = useState<PSEData>({
		personType: "",
		bank: "",
		docType: "",
		docNumber: "",
		email: "",
	});
	const [nequi, setNequiData] = useState<NequiData>({ phone: "" });
	const [bancolombia, setBancolombiaData] = useState<BancolombiaData>({
		personType: "",
		docType: "",
		docNumber: "",
	});

	const [cardErrors, setCardErrors] = useState<FormErrors<CardData>>({});
	const [pseErrors, setPseErrors] = useState<FormErrors<PSEData>>({});
	const [nequiErrors, setNequiErrors] = useState<FormErrors<NequiData>>({});
	const [bancolombiaErrors, setBancolombiaErrors] = useState<
		FormErrors<BancolombiaData>
	>({});

	function handleSubmit() {
		if (method === "card") {
			const errors = validateCard(card);
			if (Object.keys(errors).length > 0) {
				setCardErrors(errors);
				return;
			}
			setCardErrors({});
		} else if (method === "pse") {
			const errors = validatePSE(pse);
			if (Object.keys(errors).length > 0) {
				setPseErrors(errors);
				return;
			}
			setPseErrors({});
		} else if (method === "nequi") {
			const errors = validateNequi(nequi);
			if (Object.keys(errors).length > 0) {
				setNequiErrors(errors);
				return;
			}
			setNequiErrors({});
		} else {
			const errors = validateBancolombia(bancolombia);
			if (Object.keys(errors).length > 0) {
				setBancolombiaErrors(errors);
				return;
			}
			setBancolombiaErrors({});
		}
		onPlaceOrder();
	}

	function setCardField<K extends keyof CardData>(key: K, value: CardData[K]) {
		setCardData((prev) => ({ ...prev, [key]: value }));
		if (cardErrors[key])
			setCardErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function setPseField<K extends keyof PSEData>(key: K, value: PSEData[K]) {
		setPseData((prev) => ({ ...prev, [key]: value }));
		if (pseErrors[key]) setPseErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function setNequiField<K extends keyof NequiData>(
		key: K,
		value: NequiData[K],
	) {
		setNequiData((prev) => ({ ...prev, [key]: value }));
		if (nequiErrors[key])
			setNequiErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	function setBancolombiaField<K extends keyof BancolombiaData>(
		key: K,
		value: BancolombiaData[K],
	) {
		setBancolombiaData((prev) => ({ ...prev, [key]: value }));
		if (bancolombiaErrors[key])
			setBancolombiaErrors((prev) => ({ ...prev, [key]: undefined }));
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-2">
				<CreditCard className="size-4 text-muted-foreground" />
				<h2 className="text-xl font-bold tracking-tight">Payment</h2>
			</div>

			{/* Shipping summary */}
			<div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
				<div className="flex items-start justify-between gap-2">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
							Shipping to
						</p>
						<p className="mt-0.5 text-sm font-medium">{billing.fullName}</p>
						<p className="text-xs text-muted-foreground">
							{billing.address1}
							{billing.address2 ? `, ${billing.address2}` : ""}, {billing.city},{" "}
							{billing.state} {billing.zip}, {billing.country}
						</p>
					</div>
					<button
						type="button"
						onClick={onBack}
						className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						Edit
					</button>
				</div>
			</div>

			{/* Method picker */}
			<div>
				<p className="mb-3 text-sm font-medium">Payment method</p>
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
					{PAYMENT_METHODS.map(({ id, label, sublabel, Icon, accent }) => (
						<button
							key={id}
							type="button"
							aria-pressed={method === id}
							onClick={() => setMethod(id)}
							className={cn(
								"flex flex-col gap-2 rounded-xl border p-3 text-left transition-colors",
								method === id
									? "border-foreground bg-card shadow-sm"
									: "border-border bg-card/40 hover:bg-card",
							)}
						>
							<Icon className={cn("size-5", accent)} />
							<div>
								<p className="text-xs font-semibold leading-tight">{label}</p>
								<p className="mt-0.5 text-[10px] text-muted-foreground">
									{sublabel}
								</p>
							</div>
						</button>
					))}
				</div>
			</div>

			{/* Method-specific fields */}
			<div className="rounded-xl border border-border bg-card/60 p-4">
				{method === "card" && (
					<CardForm data={card} errors={cardErrors} setField={setCardField} />
				)}
				{method === "pse" && (
					<PSEForm data={pse} errors={pseErrors} setField={setPseField} />
				)}
				{method === "nequi" && (
					<NequiForm
						data={nequi}
						errors={nequiErrors}
						setField={setNequiField}
					/>
				)}
				{method === "bancolombia" && (
					<BancolombiaForm
						data={bancolombia}
						errors={bancolombiaErrors}
						setField={setBancolombiaField}
					/>
				)}
			</div>

			{/* Actions */}
			<div className="flex flex-col-reverse gap-3 sm:flex-row">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<ChevronLeft className="size-4" />
					Back
				</button>
				<Button
					type="button"
					onClick={handleSubmit}
					className="h-11 flex-1 rounded-xl text-sm font-semibold"
				>
					<Lock className="size-4" />
					Place Order — ${total.toFixed(2)}
				</Button>
			</div>
		</div>
	);
}
