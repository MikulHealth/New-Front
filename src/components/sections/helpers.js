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
  
  export const calculateEndDate = (servicePlan, startDate, duration, customizedPlans, setFormFields) => {
    if (!startDate) return;
  
    let endDate;
  
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
  
    setFormFields((prevFields) => ({ ...prevFields, endDate }));
  };
  
  export const calculateUrgency = (date, setPriority) => {
    const now = new Date();
    const diffInHours = (date - now) / (1000 * 60 * 60);
  
    if (diffInHours <= 24) {
      setPriority("High");
    } else if (diffInHours <= 48) {
      setPriority("Medium");
    } else if (diffInHours <= 72) {
      setPriority("Normal");
    } else {
      setPriority("Flexible");
    }
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
  