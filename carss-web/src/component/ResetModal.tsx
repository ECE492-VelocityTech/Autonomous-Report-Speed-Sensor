import styles from "../styles/Modal.module.css";
import { RiCloseLine } from "react-icons/ri";

interface ResetModalProps {
    setIsOpen: (isOpen: boolean) => void;
}

const ResetModal = ({ setIsOpen }: ResetModalProps) => {
    function handleConfirm() {
        console.log("Confirmed");
        setIsOpen(false);
        sessionStorage.setItem("deviceNumber", "");
        sessionStorage.setItem("startDate", "");
    }

    return (
        <>
            <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
            <div className={styles.centered}>
                <div className={styles.modal}>
                    <div className={styles.modalHeader}>
                        <h5 className={styles.heading}>Reset Device</h5>
                    </div>
                    <button
                        className={styles.closeBtn}
                        onClick={() => setIsOpen(false)}
                    >
                        <RiCloseLine style={{ marginBottom: "-3px" }} />
                    </button>
                    <div className={styles.modalContent}>
                        Are you sure you want to reset?
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

export default ResetModal;
