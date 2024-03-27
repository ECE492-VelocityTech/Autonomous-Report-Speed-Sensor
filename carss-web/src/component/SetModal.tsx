import styles from "../styles/Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

interface SetModalProps {
    setIsOpen: (isOpen: boolean) => void;
    deviceNumber: string;
    address: string;
}

const SetModal = ({ setIsOpen, deviceNumber, address }: SetModalProps) => {
    function handleConfirm() {
        console.log("Confirmed");
        setIsOpen(false);
        sessionStorage.setItem("deviceNumber", deviceNumber);
        sessionStorage.setItem("startDate", "");
    }

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>
                            Device: {deviceNumber}
                        </h5>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsOpen(false)}
                    >
                        <RiCloseLine style={{ marginBottom: "-3px" }} />
                    </button>
                    <div className={styles.modalContent}>
                        <p className={styles.address}>{address}</p>
                        Are you sure you want to select this device?
                    </div>
                    <div className={styles.modalActions}>
                        <div className={styles.actionsContainer}>
                            <button
                                className="btn btn-primary"
                                onClick={handleConfirm}
                            >
                                Yes
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetModal;
