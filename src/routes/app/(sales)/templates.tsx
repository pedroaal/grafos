import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";
import { createEffect, createResource, For } from "solid-js";

import BlueBoard from "~/components/core/BlueBoard";
import Breadcrumb from "~/components/core/Breadcrumb";
import Pagination from "~/components/core/Pagination";
import RowActions from "~/components/core/RowActions";
import Table from "~/components/core/Table";

import { AppRoutes } from "~/config/routes";
import { useApp } from "~/context/app";
import { usePagination } from "~/hooks/usePagination";
import { deleteTemplate, listTemplates } from "~/services/sales/templates";
import type { Templates } from "~/types/appwrite";

const TemplatesPage = () => {
	const nav = useNavigate();
	const { addAlert } = useApp();
	const pager = usePagination();

	const [templatesCollection, { refetch: refreshTemplates }] = createResource(
		() => ({
			page: pager.page(),
			perPage: pager.perPage(),
		}),
		listTemplates,
	);

	createEffect(() => {
		const fetchedTemplates = templatesCollection();
		if (fetchedTemplates) {
			pager.setTotalItems(fetchedTemplates.total);
		}
	});

	const openTemplateEditor = (templateId: string): void => {
		nav(`${AppRoutes.template}/${templateId}`);
	};

	const destroyTemplate = async (
		templateId: string,
		templateName: string,
	): Promise<void> => {
		const shouldDelete = window.confirm(
			`¿Desea eliminar la plantilla "${templateName}"?`,
		);
		if (!shouldDelete) return;

		try {
			await deleteTemplate(templateId);
			addAlert({
				type: "success",
				message: "Plantilla eliminada correctamente",
			});
			refreshTemplates();
		} catch (err: any) {
			addAlert({
				type: "error",
				message: err.message || "Fallo al eliminar plantilla",
			});
		}
	};

	const truncateContent = (text: string, maxChars: number = 80): string => {
		if (text.length <= maxChars) return text;
		return `${text.substring(0, maxChars)}...`;
	};

	const hasLogoIcon = (logoUrl: string | null): string => {
		return logoUrl ? "✓" : "—";
	};

	return (
		<>
			<Title>Plantillas - Grafos</Title>
			<Breadcrumb links={[{ label: "Ventas" }, { label: "Plantillas" }]} />
			<BlueBoard
				title="Plantillas"
				links={[
					{
						href: AppRoutes.template,
						label: "Nueva",
					},
				]}
			>
				<Table
					headers={[
						{ label: "Nombre" },
						{ label: "Contenido" },
						{ label: "Logo" },
						{ label: "", class: "w-1/12" },
					]}
				>
					<For each={templatesCollection()?.rows || []}>
						{(tpl: Templates) => (
							<tr>
								<td>{tpl.name}</td>
								<td class="max-w-md truncate">
									{truncateContent(tpl.content)}
								</td>
								<td class="text-center">{hasLogoIcon(tpl.logo)}</td>
								<td>
									<RowActions
										onEdit={() => openTemplateEditor(tpl.$id)}
										onDelete={() => destroyTemplate(tpl.$id, tpl.name)}
									/>
								</td>
							</tr>
						)}
					</For>
				</Table>
				<Pagination
					page={pager.page()}
					totalPages={pager.totalPages()}
					totalItems={pager.totalItems()}
					perPage={pager.perPage()}
					onPageChange={pager.setPage}
					onPerPageChange={pager.setPerPage}
				/>
			</BlueBoard>
		</>
	);
};

export default TemplatesPage;
