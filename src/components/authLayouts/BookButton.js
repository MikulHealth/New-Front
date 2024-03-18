import React, { useState } from 'react';
import BookAppointmentModal from "../sections/BookAppointment";

export default function BookButton() {
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const handleCloseAppointmentModal = () => {
        setShowAppointmentModal(false);
    };

    
//   const handleOpenAppointmentModal = () => {
//     setShowAppointmentModal(true);
//   };

    return (
        <div>
            <BookAppointmentModal
                isOpen={showAppointmentModal}
                onClose={handleCloseAppointmentModal}
            />
        </div>
    );
}
