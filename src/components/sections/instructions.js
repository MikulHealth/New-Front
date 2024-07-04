export const displayPostSubmissionInstructions = (
  formData,
  vitalsOutOfRange,
  setInstructions,
  setModalOpen
) => {
  const instructions = [];

  if (vitalsOutOfRange.temperature) {
    if (formData.temperature < 36) {
      instructions.push(
        "The patient's temperature is a bit low. Ensure they are kept warm and monitor closely. If the low temperature persists, please contact the supervisor or call the doctor."
      );
    } else if (formData.temperature > 37.5) {
      instructions.push(
        "The patient's temperature is a bit high. Consider administering an antipyretic and encourage hydration. If the high temperature persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (vitalsOutOfRange.bloodPressure) {
    const [systolic, diastolic] = formData.bloodPressure.split("/").map(Number);
    if (systolic < 90) {
      instructions.push(
        "The systolic blood pressure is low. Ensure adequate fluid intake and monitor for signs of shock. If the low blood pressure persists, please contact the supervisor or call the doctor."
      );
    } else if (systolic > 140) {
      instructions.push(
        "The systolic blood pressure is high. Consider administering antihypertensive medication as prescribed. If the high blood pressure persists, please contact the supervisor or call the doctor."
      );
    }
    if (diastolic < 60) {
      instructions.push(
        "The diastolic blood pressure is low. Ensure adequate fluid intake and monitor for signs of shock. If the low blood pressure persists, please contact the supervisor or call the doctor."
      );
    } else if (diastolic > 90) {
      instructions.push(
        "The diastolic blood pressure is high. Consider administering antihypertensive medication as prescribed. If the high blood pressure persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (vitalsOutOfRange.pulse) {
    if (formData.pulse < 60) {
      instructions.push(
        "The pulse is a bit low (bradycardia). Assess for symptoms of dizziness or fatigue. If the low pulse persists, please contact the supervisor or call the doctor."
      );
    } else if (formData.pulse > 100) {
      instructions.push(
        "The pulse is a bit high (tachycardia). Assess for pain, fever, or anxiety and treat accordingly. If the high pulse persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (vitalsOutOfRange.bloodSugar) {
    if (formData.bloodSugar < 70) {
      instructions.push(
        "The blood sugar level is low (hypoglycemia). Provide a quick source of sugar, such as juice or glucose tablets. If the low blood sugar persists, please contact the supervisor or call the doctor."
      );
    } else if (formData.bloodSugar > 140) {
      instructions.push(
        "The blood sugar level is high (hyperglycemia). Administer insulin as prescribed and encourage hydration. If the high blood sugar persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (vitalsOutOfRange.sp02) {
    if (formData.sp02 < 95) {
      instructions.push(
        "The SpO2 level is low. Ensure the patient is receiving adequate oxygen and check for any obstruction in the airway. If the low SpO2 persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (vitalsOutOfRange.respiration) {
    if (formData.respiration < 12) {
      instructions.push(
        "The respiration rate is low (bradypnea). Assess for signs of respiratory depression. If the low respiration rate persists, please contact the supervisor or call the doctor."
      );
    } else if (formData.respiration > 20) {
      instructions.push(
        "The respiration rate is high (tachypnea). Assess for underlying causes such as infection or anxiety. If the high respiration rate persists, please contact the supervisor or call the doctor."
      );
    }
  }
  if (formData.mood === "Sad") {
    instructions.push(
      "The patient is feeling sad. Provide emotional support and consider arranging for counseling. Monitor for any signs of worsening mood."
    );
  } else if (formData.mood === "Anxious") {
    instructions.push(
      "The patient is feeling anxious. Provide reassurance, encourage relaxation techniques, and monitor for any signs of severe anxiety."
    );
  } else if (formData.mood === "Angry") {
    instructions.push(
      "The patient is feeling angry. Address any potential causes of frustration, provide a calm environment, and monitor for any signs of aggression."
    );
  }
  if (formData.emotionalState === "Unstable") {
    instructions.push(
      "The emotional state is unstable. Provide support, consider arranging for a mental health evaluation, and monitor closely."
    );
  } else if (formData.emotionalState === "Depressed") {
    instructions.push(
      "The emotional state is depressed. Provide emotional support, consider arranging for counseling, and monitor for any signs of severe depression."
    );
  } else if (formData.emotionalState === "Elevated") {
    instructions.push(
      "The emotional state is elevated. Monitor for any signs of mania or hyperactivity, and provide a calming environment."
    );
  }
  if (formData.physicalState === "Poor") {
    instructions.push(
      "The physical state is poor. Assess for any underlying medical conditions, provide necessary medical interventions, and monitor closely."
    );
  }
  if (formData.painLevel === "Moderate") {
    instructions.push(
      "The pain level is moderate. Provide pain relief medication as prescribed, and monitor for any changes in pain level."
    );
  } else if (
    formData.painLevel === "Severe" ||
    formData.painLevel === "Very Severe"
  ) {
    instructions.push(
      "The pain level is severe. Provide strong pain relief medication as prescribed, consider non-pharmacological interventions, and monitor closely."
    );
  }

  if (instructions.length > 0) {
    setInstructions(instructions);
    setModalOpen(true);
  }
};

export const generateRecommendations = (
  formData,
  vitalsOutOfRange,
  patientFullName,
  medicFullName
) => {
  const patientFirstName = patientFullName.split(" ")[0];
  const medicFirstName = medicFullName.split(" ")[0];

  const recommendations = [];

  if (vitalsOutOfRange.temperature) {
    if (formData.temperature < 36) {
      recommendations.push(
        `${patientFirstName}'s temperature was a bit low. ${medicFirstName} has been advised to ensure they are kept warm and monitor closely. If the low temperature persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (formData.temperature > 37.5) {
      recommendations.push(
        `${patientFirstName}'s temperature was a bit high. ${medicFirstName} has been advised to consider administering an antipyretic and encourage hydration. If the high temperature persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (vitalsOutOfRange.bloodPressure) {
    const [systolic, diastolic] = formData.bloodPressure.split("/").map(Number);
    if (systolic < 90) {
      recommendations.push(
        `${patientFirstName}'s systolic blood pressure was low. ${medicFirstName} has been advised to ensure adequate fluid intake and monitor for signs of shock. If the low blood pressure persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (systolic > 140) {
      recommendations.push(
        `${patientFirstName}'s systolic blood pressure was high. ${medicFirstName} has been advised to consider administering antihypertensive medication as prescribed. If the high blood pressure persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
    if (diastolic < 60) {
      recommendations.push(
        `${patientFirstName}'s diastolic blood pressure was low. ${medicFirstName} has been advised to ensure adequate fluid intake and monitor for signs of shock. If the low blood pressure persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (diastolic > 90) {
      recommendations.push(
        `${patientFirstName}'s diastolic blood pressure was high. ${medicFirstName} has been advised to consider administering antihypertensive medication as prescribed. If the high blood pressure persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (vitalsOutOfRange.pulse) {
    if (formData.pulse < 60) {
      recommendations.push(
        `${patientFirstName}'s pulse was a bit low (bradycardia). ${medicFirstName} has been advised to assess for symptoms of dizziness or fatigue. If the low pulse persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (formData.pulse > 100) {
      recommendations.push(
        `${patientFirstName}'s pulse was a bit high (tachycardia). ${medicFirstName} has been advised to assess for pain, fever, or anxiety and treat accordingly. If the high pulse persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (vitalsOutOfRange.bloodSugar) {
    if (formData.bloodSugar < 70) {
      recommendations.push(
        `${patientFirstName}'s blood sugar level was low (hypoglycemia). ${medicFirstName} has been advised to provide a quick source of sugar, such as juice or glucose tablets. If the low blood sugar persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (formData.bloodSugar > 140) {
      recommendations.push(
        `${patientFirstName}'s blood sugar level was high (hyperglycemia). ${medicFirstName} has been advised to administer insulin as prescribed and encourage hydration. If the high blood sugar persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (vitalsOutOfRange.sp02) {
    if (formData.sp02 < 95) {
      recommendations.push(
        `${patientFirstName}'s SpO2 level was low. ${medicFirstName} has been advised to ensure they are receiving adequate oxygen and check for any obstruction in the airway. If the low SpO2 persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (vitalsOutOfRange.respiration) {
    if (formData.respiration < 12) {
      recommendations.push(
        `${patientFirstName}'s respiration rate was low (bradypnea). ${medicFirstName} has been advised to assess for signs of respiratory depression. If the low respiration rate persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    } else if (formData.respiration > 20) {
      recommendations.push(
        `${patientFirstName}'s respiration rate was high (tachypnea). ${medicFirstName} has been advised to assess for underlying causes such as infection or anxiety. If the high respiration rate persists, ${medicFirstName} will contact the supervisor or call the doctor.`
      );
    }
  }
  if (formData.mood === "Sad") {
    recommendations.push(
      `${patientFirstName} was feeling sad. ${medicFirstName} has been advised to provide emotional support and consider arranging for counseling. ${medicFirstName} will monitor for any signs of worsening mood.`
    );
  } else if (formData.mood === "Anxious") {
    recommendations.push(
      `${patientFirstName} was feeling anxious. ${medicFirstName} has been advised to provide reassurance, encourage relaxation techniques, and monitor for any signs of severe anxiety.`
    );
  } else if (formData.mood === "Angry") {
    recommendations.push(
      `${patientFirstName} was feeling angry. ${medicFirstName} has been advised to address any potential causes of frustration, provide a calm environment, and monitor for any signs of aggression.`
    );
  }
  if (formData.emotionalState === "Unstable") {
    recommendations.push(
      `${patientFirstName}'s emotional state was unstable. ${medicFirstName} has been advised to provide support, consider arranging for a mental health evaluation, and monitor closely.`
    );
  } else if (formData.emotionalState === "Depressed") {
    recommendations.push(
      `${patientFirstName}'s emotional state was depressed. ${medicFirstName} has been advised to provide emotional support, consider arranging for counseling, and monitor for any signs of severe depression.`
    );
  } else if (formData.emotionalState === "Elevated") {
    recommendations.push(
      `${patientFirstName}'s emotional state was elevated. ${medicFirstName} has been advised to monitor for any signs of mania or hyperactivity, and provide a calming environment.`
    );
  }
  if (formData.physicalState === "Poor") {
    recommendations.push(
      `${patientFirstName}'s physical state was poor. ${medicFirstName} has been advised to assess for any underlying medical conditions, provide necessary medical interventions, and monitor closely.`
    );
  }
  if (formData.painLevel === "Moderate") {
    recommendations.push(
      `${patientFirstName}'s pain level was moderate. ${medicFirstName} has been advised to provide pain relief medication as prescribed, and monitor for any changes in pain level.`
    );
  } else if (
    formData.painLevel === "Severe" ||
    formData.painLevel === "Very Severe"
  ) {
    recommendations.push(
      `${patientFirstName}'s pain level was severe. ${medicFirstName} has been advised to provide strong pain relief medication as prescribed, consider non-pharmacological interventions, and monitor closely.`
    );
  }

  recommendations.push(
    `Please rest assured that ${medicFirstName}, the medic, is taking the right steps to ensure ${patientFirstName}'s well-being. However, feel free to call ${medicFirstName} to follow up if you have any concerns.`
  );

  return recommendations;
};
