import Swal from 'sweetalert2';
import 'animate.css';
import { Messages } from './config';

const commonCustomStyle = {
	customClass: {
		popup: 'swal2-popup-lux',
		title: 'swal2-title-lux',
		content: 'swal2-text-lux',
		confirmButton: 'swal2-confirm-lux',
		cancelButton: 'swal2-cancel-lux',
	},
	background: '#f9f6f2',
	backdrop: 'rgba(34, 27, 24, 0.3)',
};

export const sweetErrorHandling = async (err: any) => {
	await Swal.fire({
		icon: 'error',
		text: err.message,
		showConfirmButton: false,
		...commonCustomStyle,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		position: 'center',
		icon: 'success',
		title: msg.replace('Definer: ', ''),
		showConfirmButton: false,
		timer: duration,
		...commonCustomStyle,
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	await Swal.fire({
		title: msg,
		showClass: {
			popup: 'animate__bounceIn',
		},
		showConfirmButton: false,
		timer: duration,
		...commonCustomStyle,
	});
};

export const sweetConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			icon: 'question',
			text: msg,
			showClass: {
				popup: 'animate__bounceIn',
			},
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonColor: '#a67c52',
			cancelButtonColor: '#bdbdbd',
			...commonCustomStyle,
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetLoginConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await Swal.fire({
			text: msg,
			showCancelButton: true,
			showConfirmButton: true,
			color: '#2e2424',
			confirmButtonColor: '#a67c52',
			cancelButtonColor: '#bdbdbd',
			confirmButtonText: 'Login',
			...commonCustomStyle,
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await Swal.fire({
		icon: 'error',
		title: msg,
		showConfirmButton: false,
		timer: duration,
		...commonCustomStyle,
	});
};

export const sweetMixinErrorAlert = async (
	msg: string,
	duration: number = 3000,
	onClose?: () => void
  ) => {
	await Swal.fire({
	  icon: 'error',
	  title: msg,
	  showConfirmButton: false,
	  timer: duration,
	  ...commonCustomStyle,
	  didClose: onClose, // callback after alert closes
	});
  };
  

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await Swal.fire({
		icon: 'success',
		title: msg,
		showConfirmButton: false,
		timer: duration,
		...commonCustomStyle,
	});
};

export const sweetBasicAlert = async (text: string) => {
	await Swal.fire({
		text,
		...commonCustomStyle,
	});
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = err.message ?? Messages.error1;
	await Swal.fire({
		icon: 'error',
		text: errorMessage,
		showConfirmButton: false,
		...commonCustomStyle,
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	const Toast = Swal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: duration,
		timerProgressBar: true,
		customClass: {
			popup: 'swal2-toast-lux',
			title: 'swal2-title-lux',
		},
		background: '#f5ede6',
	});

	Toast.fire({
		icon: 'success',
		title: msg,
	}).then((data) => {
		if (enable_forward) {
			window.location.reload();
		}
	});
};
