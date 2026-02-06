import { createForm, setValues, submit, valiForm } from "@modular-forms/solid";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import type { Models } from "appwrite";
import dayjs from "dayjs";
import { createEffect, createResource, on } from "solid-js";
import { createStore } from "solid-js/store";
import {
	boolean,
	nullable,
	number,
	object,
	string,
	enum as venum,
} from "valibot";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Checkbox from "~/components/core/Checkbox";
import Input from "~/components/core/Input";
import Select from "~/components/core/Select";
import DashboardLayout from "~/components/layouts/Dashboard";
import PayrollDocumentsSection, {
	type DocumentForm,
	documentDefault,
} from "~/components/employees/PayrollDocuments";
import PayrollEducationSection, {
	type EducationForm,
	educationDefault,
} from "~/components/employees/PayrollEducation";
import PayrollEquipmentSection, {
	type EquipmentForm,
	equipmentDefault,
} from "~/components/employees/PayrollEquipment";
import PayrollFamilySection, {
	type FamilyForm,
	familyDefault,
} from "~/components/employees/PayrollFamily";
import PayrollReferencesSection, {
	type ReferenceForm,
	referenceDefault,
} from "~/components/employees/PayrollReferences";
import {
	PayrollBankAccountType,
	PayrollBloodType,
	PayrollGender,
	PayrollMaritalStatus,
} from "~/config/appwrite";
import { Routes } from "~/config/routes";
import { useApp } from "~/context/app";
import { listCostCenters } from "~/services/accounting/costCenters";
import { syncPayrollDocuments } from "~/services/employees/payrollDocuments";
import { syncPayrollEducation } from "~/services/employees/payrollEducation";
import { syncPayrollEquipment } from "~/services/employees/payrollEquipment";
import { syncPayrollFamily } from "~/services/employees/payrollFamily";
import { syncPayrollReferences } from "~/services/employees/payrollReferences";
import {
	createPayroll,
	getPayroll,
	updatePayroll,
} from "~/services/employees/payroll";
import { listPayrollDocuments } from "~/services/employees/payrollDocuments";
import { listPayrollEducation } from "~/services/employees/payrollEducation";
import { listPayrollEquipment } from "~/services/employees/payrollEquipment";
import { listPayrollFamily } from "~/services/employees/payrollFamily";
import { listPayrollReferences } from "~/services/employees/payrollReferences";
import { listSchedules } from "~/services/employees/schedules";
import type { Payroll } from "~/types/appwrite";

const PayrollSchema = object({
	idNumber: string(),
	photo: nullable(string()),
	birthDate: string(),
	birthPlace: string(),
	nationality: string(),
	nativeLanguage: string(),
	firstName: string(),
	lastName: string(),
	address: string(),
	sector: string(),
	homeVisit: boolean(),
	visitDate: nullable(string()),
	phone: nullable(string()),
	mobile: string(),
	email: string(),
	bloodType: venum(PayrollBloodType),
	medicalConditions: nullable(string()),
	allergies: nullable(string()),
	emergencyContactName: nullable(string()),
	emergencyContactAddress: nullable(string()),
	emergencyContactMobile: nullable(string()),
	emergencyContactOffice: nullable(string()),
	gender: venum(PayrollGender),
	maritalStatus: venum(PayrollMaritalStatus),
	childrenCount: nullable(number()),
	hireDate: string(),
	terminationDate: nullable(string()),
	position: string(),
	costCenterId: string(),
	socialSecurityEnrollment: nullable(string()),
	socialSecurityEmployerPaid: boolean(),
	salary: number(),
	monthlySettlement: boolean(),
	bankId: number(),
	bankAccountType: venum(PayrollBankAccountType),
	bankAccountNumber: string(),
	notes: nullable(string()),
	scheduleId: string(),
	canOvertime: boolean(),
	active: boolean(),
});

type PayrollForm = Omit<
	Payroll,
	keyof Models.Row | "costCenterId" | "scheduleId"
> & {
	costCenterId: string;
	scheduleId: string;
};

const payrollDefault: PayrollForm = {
	idNumber: "",
	photo: null,
	birthDate: dayjs().subtract(18, "years").format("YYYY-MM-DD"),
	birthPlace: "",
	nationality: "Ecuatoriana",
	nativeLanguage: "Español",
	firstName: "",
	lastName: "",
	address: "",
	sector: "",
	homeVisit: false,
	visitDate: null,
	phone: null,
	mobile: "",
	email: "",
	bloodType: PayrollBloodType.OP,
	medicalConditions: null,
	allergies: null,
	emergencyContactName: null,
	emergencyContactAddress: null,
	emergencyContactMobile: null,
	emergencyContactOffice: null,
	gender: PayrollGender.MALE,
	maritalStatus: PayrollMaritalStatus.SINGLE,
	childrenCount: null,
	hireDate: dayjs().format("YYYY-MM-DD"),
	terminationDate: null,
	position: "",
	costCenterId: "",
	socialSecurityEnrollment: null,
	socialSecurityEmployerPaid: false,
	salary: 0,
	monthlySettlement: false,
	bankId: 0,
	bankAccountType: PayrollBankAccountType.SAVINGS,
	bankAccountNumber: "",
	notes: null,
	scheduleId: "",
	canOvertime: false,
	active: true,
};

const PayrollPage = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { addAlert, addLoader, removeLoader } = useApp();

	const isEdit = () => Boolean(params.id);

	const [form, { Form, Field }] = createForm<PayrollForm>({
		validate: valiForm(PayrollSchema),
		initialValues: payrollDefault,
	});

	const [costCenters] = createResource({}, listCostCenters);
	const [schedules] = createResource({}, listSchedules);
	const [payroll] = createResource(params.id, getPayroll);
	const [payrollDocuments] = createResource(
		{ payrollId: params.id || "" },
		listPayrollDocuments,
	);
	const [payrollEducation] = createResource(
		{ payrollId: params.id || "" },
		listPayrollEducation,
	);
	const [payrollEquipment] = createResource(
		{ payrollId: params.id || "" },
		listPayrollEquipment,
	);
	const [payrollFamily] = createResource(
		{ payrollId: params.id || "" },
		listPayrollFamily,
	);
	const [payrollReferences] = createResource(
		{ payrollId: params.id || "" },
		listPayrollReferences,
	);

	const [documents, setDocuments] = createStore<DocumentForm>(documentDefault);
	const [education, setEducation] = createStore<EducationForm[]>([]);
	const [equipment, setEquipment] = createStore<EquipmentForm[]>([]);
	const [family, setFamily] = createStore<FamilyForm[]>([]);
	const [references, setReferences] = createStore<ReferenceForm[]>([]);

	createEffect(
		on(
			() => payroll(),
			(payroll) => {
				if (!payroll || !isEdit()) return;

				setValues(form, {
					idNumber: payroll.idNumber,
					photo: payroll.photo,
					birthDate: dayjs(payroll.birthDate).format("YYYY-MM-DD"),
					birthPlace: payroll.birthPlace,
					nationality: payroll.nationality,
					nativeLanguage: payroll.nativeLanguage,
					firstName: payroll.firstName,
					lastName: payroll.lastName,
					address: payroll.address,
					sector: payroll.sector,
					homeVisit: payroll.homeVisit,
					visitDate: payroll.visitDate
						? dayjs(payroll.visitDate).format("YYYY-MM-DD")
						: null,
					phone: payroll.phone,
					mobile: payroll.mobile,
					email: payroll.email,
					bloodType: payroll.bloodType,
					medicalConditions: payroll.medicalConditions,
					allergies: payroll.allergies,
					emergencyContactName: payroll.emergencyContactName,
					emergencyContactAddress: payroll.emergencyContactAddress,
					emergencyContactMobile: payroll.emergencyContactMobile,
					emergencyContactOffice: payroll.emergencyContactOffice,
					gender: payroll.gender,
					maritalStatus: payroll.maritalStatus,
					childrenCount: payroll.childrenCount,
					hireDate: dayjs(payroll.hireDate).format("YYYY-MM-DD"),
					terminationDate: payroll.terminationDate
						? dayjs(payroll.terminationDate).format("YYYY-MM-DD")
						: null,
					position: payroll.position,
					costCenterId: payroll.costCenterId?.$id || "",
					socialSecurityEnrollment: payroll.socialSecurityEnrollment,
					socialSecurityEmployerPaid: payroll.socialSecurityEmployerPaid,
					salary: payroll.salary,
					monthlySettlement: payroll.monthlySettlement,
					bankId: payroll.bankId,
					bankAccountType: payroll.bankAccountType,
					bankAccountNumber: payroll.bankAccountNumber,
					notes: payroll.notes,
					scheduleId: payroll.scheduleId?.$id || "",
					canOvertime: payroll.canOvertime,
					active: payroll.active,
				});
			},
		),
	);

	createEffect(
		on(
			() => payrollDocuments(),
			(docs) => {
				if (!docs || !isEdit() || docs.rows.length === 0) return;
				const doc = docs.rows[0];
				setDocuments({
					entryNotice: doc.entryNotice,
					workContract: doc.workContract,
					jobApplication: doc.jobApplication,
					resume: doc.resume,
					idCard: doc.idCard,
					voterCard: doc.voterCard,
					policeRecord: doc.policeRecord,
					militaryCard: doc.militaryCard,
					elementaryCertificate: doc.elementaryCertificate,
					highSchoolCertificate: doc.highSchoolCertificate,
					universityCertificate: doc.universityCertificate,
					otherCertificate: doc.otherCertificate,
					employmentReferences: doc.employmentReferences,
					personalReferences: doc.personalReferences,
					medicalCertificate: doc.medicalCertificate,
					exitNotice: doc.exitNotice,
					settlementAct: doc.settlementAct,
					settlementPaymentReceipt: doc.settlementPaymentReceipt,
				});
			},
		),
	);

	createEffect(
		on(
			() => payrollEducation(),
			(edu) => {
				if (!edu || !isEdit()) return;
				const data: EducationForm[] = edu.rows.map((item) => ({
					$id: item.$id,
					educationLevel: item.educationLevel,
					institutionName: item.institutionName,
					startDate: item.startDate,
					endDate: item.endDate,
					degree: item.degree,
				}));
				setEducation(data);
			},
		),
	);

	createEffect(
		on(
			() => payrollEquipment(),
			(eq) => {
				if (!eq || !isEdit()) return;
				const data: EquipmentForm[] = eq.rows.map((item) => ({
					$id: item.$id,
					deliveryDate: item.deliveryDate,
					equipmentId: item.equipmentId?.$id || "",
				}));
				setEquipment(data);
			},
		),
	);

	createEffect(
		on(
			() => payrollFamily(),
			(fam) => {
				if (!fam || !isEdit()) return;
				const data: FamilyForm[] = fam.rows.map((item) => ({
					$id: item.$id,
					relationship: item.relationship,
					name: item.name,
					birthDate: item.birthDate,
					occupation: item.occupation,
					phone: item.phone,
					mobile: item.mobile,
				}));
				setFamily(data);
			},
		),
	);

	createEffect(
		on(
			() => payrollReferences(),
			(refs) => {
				if (!refs || !isEdit()) return;
				const data: ReferenceForm[] = refs.rows.map((item) => ({
					$id: item.$id,
					referenceType: item.referenceType,
					companyName: item.companyName,
					contactName: item.contactName,
					phone: item.phone,
					relationship: item.relationship,
					startDate: item.startDate,
					endDate: item.endDate,
					position: item.position,
					separationReason: item.separationReason,
				}));
				setReferences(data);
			},
		),
	);

	const handleSubmit = async (formValues: PayrollForm) => {
		const loader = addLoader();

		try {
			let payrollId = params.id || "";
			if (isEdit() && params.id) {
				await updatePayroll(params.id, formValues);
			} else {
				const createdPayroll = await createPayroll(formValues as Payroll);
				payrollId = createdPayroll.$id;
			}

			await Promise.all([
				syncPayrollDocuments(payrollId, documents),
				syncPayrollEducation(payrollId, education),
				syncPayrollEquipment(payrollId, equipment),
				syncPayrollFamily(payrollId, family),
				syncPayrollReferences(payrollId, references),
			]);

			addAlert({
				type: "success",
				message: "Nómina guardada correctamente",
			});
			navigate(Routes.payrolls);
		} catch (error: any) {
			addAlert({
				type: "error",
				message: error.message || "Error al guardar la nómina",
			});
		} finally {
			removeLoader(loader);
		}
	};

	const bloodTypes = () => [
		{ key: PayrollBloodType.AP, label: "A+" },
		{ key: PayrollBloodType.AN, label: "A-" },
		{ key: PayrollBloodType.BP, label: "B+" },
		{ key: PayrollBloodType.BN, label: "B-" },
		{ key: PayrollBloodType.A_BP, label: "AB+" },
		{ key: PayrollBloodType.A_BN, label: "AB-" },
		{ key: PayrollBloodType.OP, label: "O+" },
		{ key: PayrollBloodType.ON, label: "O-" },
	];

	const genders = () => [
		{ key: PayrollGender.MALE, label: "Masculino" },
		{ key: PayrollGender.FEMALE, label: "Femenino" },
		{ key: PayrollGender.OTHER, label: "Otro" },
	];

	const maritalStatuses = () => [
		{ key: PayrollMaritalStatus.SINGLE, label: "Soltero" },
		{ key: PayrollMaritalStatus.MARRIED, label: "Casado" },
		{ key: PayrollMaritalStatus.DIVORCED, label: "Divorciado" },
		{ key: PayrollMaritalStatus.WIDOWED, label: "Viudo" },
		{ key: PayrollMaritalStatus.FREE_UNION, label: "Unión Libre" },
	];

	const accountTypes = () => [
		{ key: PayrollBankAccountType.SAVINGS, label: "Ahorros" },
		{ key: PayrollBankAccountType.CHECKING, label: "Corriente" },
	];

	return (
		<>
			<Title>Nómina - Grafos</Title>
			<DashboardLayout>
				<Breadcrumb
					links={[
						{ label: "Empleados" },
						{ label: "Nómina", route: Routes.payrolls },
						{ label: isEdit() ? "Editar" : "Nuevo" },
					]}
				/>
				<BlueBoard
					title="Gestionar Empleado"
					links={[
						{
							href: Routes.payroll,
							label: "Nuevo Empleado",
							disabled: !isEdit(),
						},
					]}
					actions={[
						{
							label: "Guardar",
							onClick: () => submit(form),
						},
					]}
				>
					<Form onSubmit={handleSubmit}>
						<h6 class="font-semibold mb-4">Información Personal</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-3">
								<Field name="idNumber">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Cédula"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="firstName">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombres"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="lastName">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Apellidos"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="birthDate">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Fecha Nacimiento"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="birthPlace">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Lugar Nacimiento"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="nationality">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nacionalidad"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="nativeLanguage">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Idioma Nativo"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="gender">
									{(field, props) => (
										<Select
											{...props}
											options={genders()}
											label="Género"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-6">
								<Field name="address">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Dirección"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="sector">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Sector"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="maritalStatus">
									{(field, props) => (
										<Select
											{...props}
											options={maritalStatuses()}
											label="Estado Civil"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-3">
								<Field name="phone">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Teléfono"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="mobile">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Celular"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-6">
								<Field name="email">
									{(field, props) => (
										<Input
											{...props}
											type="email"
											label="Email"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
						</div>

						<h6 class="font-semibold mb-4 mt-6">Información Médica</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-3">
								<Field name="bloodType">
									{(field, props) => (
										<Select
											{...props}
											options={bloodTypes()}
											label="Tipo de Sangre"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-5">
								<Field name="medicalConditions">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Condiciones Médicas"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-4">
								<Field name="allergies">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Alergias"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						<h6 class="font-semibold mb-4 mt-6">Contacto de Emergencia</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-4">
								<Field name="emergencyContactName">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Nombre"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-4">
								<Field name="emergencyContactAddress">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Dirección"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-2">
								<Field name="emergencyContactMobile">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Celular"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-2">
								<Field name="emergencyContactOffice">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Oficina"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						<h6 class="font-semibold mb-4 mt-6">Información Laboral</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-3">
								<Field name="hireDate">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Fecha Contratación"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="terminationDate">
									{(field, props) => (
										<Input
											{...props}
											type="date"
											label="Fecha Terminación"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="position">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Cargo"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="costCenterId">
									{(field, props) => (
										<Select
											{...props}
											options={
												costCenters()?.rows.map((cc) => ({
													key: cc.$id,
													label: cc.name,
												})) || []
											}
											label="Centro de Costo"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>

							<div class="md:col-span-4">
								<Field name="scheduleId">
									{(field, props) => (
										<Select
											{...props}
											options={
												schedules()?.rows.map((s) => ({
													key: s.$id,
													label: s.name,
												})) || []
											}
											label="Horario"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-4">
								<Field name="salary" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="Salario"
											step="0.01"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-2 flex items-end pb-2">
								<Field name="canOvertime" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Horas Extras"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-2 flex items-end pb-2">
								<Field name="active" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Activo"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						<h6 class="font-semibold mb-4 mt-6">Seguridad Social</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-6">
								<Field name="socialSecurityEnrollment">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Número Afiliación"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3 flex items-end pb-2">
								<Field name="socialSecurityEmployerPaid" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Pagado por Empleador"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3 flex items-end pb-2">
								<Field name="monthlySettlement" type="boolean">
									{(field, props) => (
										<Checkbox
											{...props}
											label="Liquidación Mensual"
											checked={field.value}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						<h6 class="font-semibold mb-4 mt-6">Información Bancaria</h6>
						<div class="grid grid-cols-1 md:grid-cols-12 gap-4">
							<div class="md:col-span-3">
								<Field name="bankId" type="number">
									{(field, props) => (
										<Input
											{...props}
											type="number"
											label="ID Banco"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-3">
								<Field name="bankAccountType">
									{(field, props) => (
										<Select
											{...props}
											options={accountTypes()}
											label="Tipo Cuenta"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
							<div class="md:col-span-6">
								<Field name="bankAccountNumber">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Número de Cuenta"
											value={field.value}
											error={field.error}
											required
										/>
									)}
								</Field>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6">
							<div class="md:col-span-12">
								<Field name="notes">
									{(field, props) => (
										<Input
											{...props}
											type="text"
											label="Notas"
											value={field.value || ""}
											error={field.error}
										/>
									)}
								</Field>
							</div>
						</div>

						<PayrollDocumentsSection
							state={documents}
							setState={setDocuments}
						/>

						<PayrollEducationSection state={education} setState={setEducation} />

						<PayrollEquipmentSection state={equipment} setState={setEquipment} />

						<PayrollFamilySection state={family} setState={setFamily} />

						<PayrollReferencesSection
							state={references}
							setState={setReferences}
						/>
					</Form>
				</BlueBoard>
			</DashboardLayout>
		</>
	);
};

export default PayrollPage;
