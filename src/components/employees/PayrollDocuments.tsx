import type { Models } from "appwrite";
import { FaSolidCheck, FaSolidXmark } from "solid-icons/fa";
import { type Component, Show, createSignal } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import Checkbox from "~/components/core/Checkbox";
import type { PayrollDocuments } from "~/types/appwrite";

interface IProps {
	state: DocumentForm;
	setState: SetStoreFunction<DocumentForm>;
}

export type DocumentForm = Omit<
	PayrollDocuments,
	keyof Models.Row | "payrollId"
>;

const documentDefault: DocumentForm = {
	entryNotice: false,
	workContract: false,
	jobApplication: false,
	resume: false,
	idCard: false,
	voterCard: false,
	policeRecord: false,
	militaryCard: false,
	elementaryCertificate: false,
	highSchoolCertificate: false,
	universityCertificate: false,
	otherCertificate: false,
	employmentReferences: false,
	personalReferences: false,
	medicalCertificate: false,
	exitNotice: false,
	settlementAct: false,
	settlementPaymentReceipt: false,
};

const PayrollDocumentsSection: Component<IProps> = (props) => {
	const documents = [
		{ key: "entryNotice", label: "Aviso de entrada" },
		{ key: "workContract", label: "Contrato de trabajo" },
		{ key: "jobApplication", label: "Solicitud de empleo" },
		{ key: "resume", label: "Hoja de vida" },
		{ key: "idCard", label: "Cédula de identidad" },
		{ key: "voterCard", label: "Carnet de votación" },
		{ key: "policeRecord", label: "Récord policial" },
		{ key: "militaryCard", label: "Carnet militar" },
		{ key: "elementaryCertificate", label: "Certificado de primaria" },
		{ key: "highSchoolCertificate", label: "Certificado de secundaria" },
		{ key: "universityCertificate", label: "Certificado universitario" },
		{ key: "otherCertificate", label: "Otros certificados" },
		{ key: "employmentReferences", label: "Referencias laborales" },
		{ key: "personalReferences", label: "Referencias personales" },
		{ key: "medicalCertificate", label: "Certificado médico" },
		{ key: "exitNotice", label: "Aviso de salida" },
		{ key: "settlementAct", label: "Acta de finiquito" },
		{ key: "settlementPaymentReceipt", label: "Recibo de pago de finiquito" },
	] as const;

	const toggleDocument = (key: keyof DocumentForm) => {
		props.setState(key, (prev) => !prev);
	};

	return (
		<div class="mt-6">
			<h6 class="font-semibold mb-4">Documentos</h6>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{documents.map((doc) => (
					<div class="form-control">
						<label class="label cursor-pointer">
							<span class="label-text">{doc.label}</span>
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={props.state[doc.key]}
								onChange={() => toggleDocument(doc.key)}
							/>
						</label>
					</div>
				))}
			</div>
		</div>
	);
};

export default PayrollDocumentsSection;
export { documentDefault };
