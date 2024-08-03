// helpers.js
export const formatDateToUTC = (selectedDate) => {
    if (!selectedDate) return "";
  
    const adjustedDate = new Date(selectedDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1);
  
    return adjustedDate.toISOString().split("T")[0];
  };
  
  export const isCustomPlan = (servicePlan, customizedPlans) => {
    return customizedPlans.some(plan => plan.name === servicePlan);
  };
  
  // export const calculateEndDate = (servicePlan, startDate, duration, customizedPlans, setFormFields) => {
  //   if (!startDate) return;
  
  //   let endDate;
  
  //   if (servicePlan === "Short home visit") {
  //     endDate = new Date(startDate);
  //     endDate.setDate(endDate.getDate() + 1);
  //   } else if (isCustomPlan(servicePlan, customizedPlans) && duration) {
  //     endDate = new Date(startDate);
  //     const parsedDuration = parseInt(duration, 10);
  //     if (!isNaN(parsedDuration)) {
  //       endDate.setDate(endDate.getDate() + parsedDuration);
  //     }
  //   } else {
  //     endDate = new Date(startDate);
  //     endDate.setMonth(endDate.getMonth() + 1);
  //   }
  
  //   setFormFields((prevFields) => ({ ...prevFields, endDate }));
  // };

  export const calculateEndDate = (servicePlan, startDate, duration, customizedPlans, setFormFields) => {
    if (!startDate) return;
  
    let endDate;
    const start = new Date(startDate);
  
    if (servicePlan === "Short home visit") {
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
    } else if (isCustomPlan(servicePlan, customizedPlans) && duration) {
      endDate = new Date(startDate);
      const parsedDuration = parseInt(duration, 10);
      if (!isNaN(parsedDuration)) {
        endDate.setDate(endDate.getDate() + parsedDuration);
      }
    } else {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
    }
  
    // Calculate the duration in days
    const calculatedDuration = Math.ceil((endDate - start) / (1000 * 60 * 60 * 24));
  
    setFormFields((prevFields) => ({
      ...prevFields,
      endDate,
      duration: calculatedDuration
    }));
  };
  
  
  export const calculateUrgency = (date, setPriority) => {
    const now = new Date();
  
    const selectedDate = new Date(date);
  
    const diffInHours = (selectedDate - now) / (1000 * 60 * 60);
  
    let priority;
    if (diffInHours <= 24) {
      priority = "High";
    } else if (diffInHours <= 48) {
      priority = "Medium";
    } else if (diffInHours <= 72) {
      priority = "Normal";
    } else {
      priority = "Flexible";
    }
  
    setPriority(priority);
  };
  
  
  export const calculateServiceCost = (servicePlan, shift, customizedPlans, setFormFields) => {
    let costOfService = 0;
  
    switch (servicePlan) {
      case "Elderly care by a Licensed Nurse":
        costOfService = shift === "Day Shift (8hrs)" ? 180000 : 220000;
        break;
      case "Elderly care by a Nurse Assistant":
        costOfService = shift === "Day Shift (8hrs)" ? 120000 : 150000;
        break;
      case "Postpartum care":
      case "Recovery care":
        costOfService = shift === "Day Shift (8hrs)" ? 200000 : 250000;
        break;
      case "Nanny care":
        costOfService = shift === "Day Shift (8hrs)" ? 70000 : 90000;
        break;
      case "Short home visit":
        costOfService = 15000;
        break;
      default:
        const customPlan = customizedPlans.find(plan => plan.name === servicePlan);
        if (customPlan) {
          costOfService = customPlan.costOfService;
        } else {
          costOfService = 0;
        }
        break;
    }
    setFormFields((prevFields) => ({ ...prevFields, costOfService }));
  };
  