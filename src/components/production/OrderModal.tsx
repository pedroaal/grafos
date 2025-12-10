import { useContext } from "solid-js";
import { Modals } from "~/config/modals";
import { PortalContext } from "~/context/portal";
import { Modal } from "../core/Modal";

const OrderModal = () => {
	const [_store, { openModal, closeModal }] = useContext(PortalContext);

	return (
		<Modal title="Nuevo Pedido" id={Modals.Order}>
			<form class="space-y-4">
				<div class="form-control">
					<label class="label">
						<span class="label-text">Cliente</span>
					</label>
					<select class="select select-bordered">
						<option disabled selected>
							Seleccionar cliente
						</option>
						<option>Cliente 1</option>
						<option>Cliente 2</option>
					</select>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Descripción</span>
					</label>
					<textarea
						class="textarea textarea-bordered"
						placeholder="Descripción del pedido"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">Fecha Pedido</span>
						</label>
						<input type="date" class="input input-bordered" />
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Fecha Entrega</span>
						</label>
						<input type="date" class="input input-bordered" />
					</div>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Cantidad</span>
					</label>
					<input type="number" class="input input-bordered" placeholder="0" />
				</div>

				<div class="modal-action">
					<button
						type="button"
						class="btn"
						onClick={() => openModal(Modals.Order2)}
					>
						test
					</button>
					<button type="button" class="btn" onClick={closeModal}>
						Cancelar
					</button>
					<button type="submit" class="btn btn-primary">
						Guardar
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default OrderModal;
