import Swal from "sweetalert2";

export function SwalCarga() {
    Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        onOpen: () => {
          Swal.showLoading();
        }
      });
}