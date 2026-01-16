import { Modals } from "~/config/modals";
import { useApp } from "~/context/app";
import { Modal } from "../core/Modal";

const OrderModal = () => {
	const { closeModal } = useApp();

	return (
		<Modal title="Nuevo Pedido" id={Modals.Order}>
			<form>
				<div class="form-control">
					<label class="label">
						<span class="label-text">Cliente</span>
						<select class="select select-bordered">
							<option disabled selected>
								Seleccionar cliente
							</option>
							<option>Cliente 1</option>
							<option>Cliente 2</option>
						</select>
					</label>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Descripción</span>
						<textarea
							class="textarea textarea-bordered"
							placeholder="Descripción del pedido"
						/>
					</label>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label">
							<span class="label-text">Fecha Pedido</span>
							<input type="date" class="input input-bordered" />
						</label>
					</div>

					<div class="form-control">
						<label class="label">
							<span class="label-text">Fecha Entrega</span>
							<input type="date" class="input input-bordered" />
						</label>
					</div>
				</div>

				<div class="form-control">
					<label class="label">
						<span class="label-text">Cantidad</span>
						<input type="number" class="input input-bordered" placeholder="0" />
					</label>
				</div>

				<div class="modal-action">
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
