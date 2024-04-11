import { RiCloseLine } from "react-icons/ri";
import styles from "./ConfirmDeviceModal.module.css";
import { useNavigate } from "react-router-dom";

interface ConfirmDeviceModalProps {
    deviceId: number;
    setIsOpen: (isOpen: boolean) => void;
    address: string;
    speedLimit: number;
}

const ConfirmDeviceModal = ({
    deviceId,
    setIsOpen,
    address,
    speedLimit,
}: ConfirmDeviceModalProps) => {
    const navigate = useNavigate();

    function handleConfirm() {
        setIsOpen(false);
        sessionStorage.setItem("deviceId", deviceId.toString());
        sessionStorage.setItem("deviceAddress", address);
        sessionStorage.setItem("speedLimit", speedLimit.toString());

        navigate(`/trafficData`);
    }

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>Device: {deviceId}</h5>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setIsOpen(false)}
                        >
                            <RiCloseLine />
                        </button>
                    </div>
                    <div className={styles.modalContent}>
                        <p>{address}</p>
                        Are you sure you want to select this device?
                    </div>
                    <div className={styles.modalActions}>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={handleConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmDeviceModal;
