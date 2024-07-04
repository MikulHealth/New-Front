export const specialNeedsCategories = {
    "Mobility Assistance": [
      "Wheelchair User",
      "Walker/Cane Support",
      "Bedridden",
    ],
    "Medical Conditions": [
      "Diabetes Management",
      "Hypertension Management",
      "Cardiovascular Conditions",
      "Respiratory Conditions (e.g., COPD, Asthma)",
      "Neurological Conditions (e.g., Parkinson's Disease, ALS)",
    ],
    "Cognitive/Developmental Conditions": [
      "Alzheimer's Disease",
      "Dementia",
      "Autism Spectrum Disorder",
      "Down Syndrome",
      "Intellectual Disabilities",
    ],
    "Mental Health Support": [
      "Depression",
      "Anxiety Disorders",
      "Bipolar Disorder",
      "Schizophrenia",
    ],
    "Sensory Impairments": ["Vision Impairment", "Hearing Impairment"],
    "Personal Care Needs": [
      "Bathing Assistance",
      "Dressing Assistance",
      "Feeding Assistance",
      "Incontinence Care",
    ],
    "Medication Management": ["Medication Reminders", "Administering Medication"],
    "Rehabilitation Needs": [
      "Physical Therapy",
      "Occupational Therapy",
      "Speech Therapy",
    ],
    "Nutritional Support": ["Special Diet Requirements", "Tube Feeding"],
    "Post-Surgical Care": ["Wound Care", "Mobility Support", "Pain Management"],
    "Palliative/Hospice Care": [
      "Pain and Symptom Management",
      "Emotional and Spiritual Support",
    ],
    "Postpartum Care": [
      "Newborn Care",
      "Breastfeeding Support",
      "Postpartum Recovery Assistance",
      "Emotional Support for New Mothers",
    ],
    "Nanny Services": [
      "Infant Care",
      "Toddler Care",
      "School-age Child Care",
      "Homework Assistance",
      "Activities and Playtime",
      "Meal Preparation for Children",
      "Bedtime Routine Assistance",
    ],
    "Household Assistance": ["Light Housekeeping", "Warming Food"],
    Companionship: [
      "Social Interaction",
      "Recreational Activities",
      "Emotional Support",
    ],
  };
  
  export const generateNursingCarePlan = (specialNeeds) => {
    const carePlan = [];
  
    specialNeeds.forEach((need) => {
      let category;
      for (const key in specialNeedsCategories) {
        if (specialNeedsCategories[key].includes(need)) {
          category = key;
          break;
        }
      }
  
      switch (need) {
        case "Wheelchair User":
          carePlan.push({
            category: category,
            plan: "Ensure regular mobility exercises (e.g., leg stretches) every 2 hours, provide assistance with wheelchair transfers, and check for pressure sores daily."
          });
          break;
        case "Walker/Cane Support":
          carePlan.push({
            category: category,
            plan: "Assist with mobility using walker or cane, ensure safety during movement, and conduct regular balance exercises (e.g., standing on one foot) twice daily."
          });
          break;
        case "Bedridden":
          carePlan.push({
            category: category,
            plan: "Provide regular repositioning every 2 hours to prevent bedsores, assist with all daily activities, and ensure regular skin checks for pressure sores."
          });
          break;
        case "Diabetes Management":
          carePlan.push({
            category: category,
            plan: "Monitor blood sugar levels before meals and at bedtime, assist with insulin administration, plan meals according to dietary needs (e.g., low sugar and high fiber), and encourage 30 minutes of daily exercise (e.g., walking)."
          });
          break;
        case "Hypertension Management":
          carePlan.push({
            category: category,
            plan: "Monitor blood pressure twice daily, ensure adherence to prescribed medication, plan a low-sodium diet, and encourage 30 minutes of daily aerobic exercise (e.g., walking or swimming)."
          });
          break;
        case "Cardiovascular Conditions":
          carePlan.push({
            category: category,
            plan: "Provide support for cardiovascular exercises (e.g., walking, light jogging) 3 times a week, monitor heart health regularly (e.g., weekly heart rate checks), and educate on recognizing symptoms of heart issues (e.g., chest pain, shortness of breath)."
          });
          break;
        case "Respiratory Conditions (e.g., COPD, Asthma)":
          carePlan.push({
            category: category,
            plan: "Assist with breathing exercises (e.g., diaphragmatic breathing) twice daily, ensure medication adherence, maintain a clean and dust-free environment, and use a humidifier if needed."
          });
          break;
        case "Neurological Conditions (e.g., Parkinson's Disease, ALS)":
          carePlan.push({
            category: category,
            plan: "Provide support for neurological exercises (e.g., stretching, strength training) 3 times a week, assist with mobility, ensure safety in the home, and monitor for any changes in condition."
          });
          break;
        case "Alzheimer's Disease":
          carePlan.push({
            category: category,
            plan: "Ensure a safe environment (e.g., remove trip hazards), provide cognitive stimulation activities (e.g., puzzles, memory games) daily, maintain a routine, and use memory aids like labels and calendars."
          });
          break;
        case "Dementia":
          carePlan.push({
            category: category,
            plan: "Provide support with daily activities (e.g., dressing, bathing), ensure a safe and familiar environment, engage in memory-enhancing activities (e.g., storytelling, photo albums), and maintain a consistent routine."
          });
          break;
        case "Autism Spectrum Disorder":
          carePlan.push({
            category: category,
            plan: "Provide structured activities (e.g., visual schedules), support sensory needs (e.g., sensory toys), use communication aids (e.g., picture exchange communication systems), and establish a predictable routine."
          });
          break;
        case "Down Syndrome":
          carePlan.push({
            category: category,
            plan: "Provide support with developmental activities (e.g., physical therapy), ensure regular health check-ups, and use visual aids to enhance learning."
          });
          break;
        case "Intellectual Disabilities":
          carePlan.push({
            category: category,
            plan: "Provide support with daily activities (e.g., dressing, bathing), ensure a safe and supportive environment, and use simple language and visual aids for communication."
          });
          break;
        case "Depression":
          carePlan.push({
            category: category,
            plan: "Provide emotional support, encourage participation in enjoyable activities (e.g., hobbies, social events), and ensure adherence to therapy and medication."
          });
          break;
        case "Anxiety Disorders":
          carePlan.push({
            category: category,
            plan: "Provide a calming environment, support relaxation techniques (e.g., deep breathing exercises), and encourage participation in therapy sessions."
          });
          break;
        case "Bipolar Disorder":
          carePlan.push({
            category: category,
            plan: "Provide support during mood changes, ensure medication adherence, and encourage a stable routine and healthy lifestyle."
          });
          break;
        case "Schizophrenia":
          carePlan.push({
            category: category,
            plan: "Provide a supportive environment, ensure medication adherence, and assist with managing daily activities and stressors."
          });
          break;
        case "Vision Impairment":
          carePlan.push({
            category: category,
            plan: "Assist with daily activities (e.g., meal preparation, mobility), ensure a safe environment (e.g., remove trip hazards), and use adaptive devices for reading and mobility (e.g., magnifiers, white canes)."
          });
          break;
        case "Hearing Impairment":
          carePlan.push({
            category: category,
            plan: "Assist with communication (e.g., sign language, written notes), provide support with hearing devices (e.g., hearing aids), and use visual aids and gestures for effective communication."
          });
          break;
        case "Bathing Assistance":
          carePlan.push({
            category: category,
            plan: "Provide support with bathing, ensure safety in the bathroom with grab bars and non-slip mats, and maintain privacy and dignity."
          });
          break;
        case "Dressing Assistance":
          carePlan.push({
            category: category,
            plan: "Assist with dressing, ensure appropriate clothing choices, and encourage independence as much as possible."
          });
          break;
        case "Feeding Assistance":
          carePlan.push({
            category: category,
            plan: "Assist with feeding, ensure proper nutrition, and accommodate any special dietary needs or restrictions."
          });
          break;
        case "Incontinence Care":
          carePlan.push({
            category: category,
            plan: "Provide support with incontinence care, ensure hygiene, and use appropriate incontinence products to maintain comfort and dignity."
          });
          break;
        case "Medication Reminders":
          carePlan.push({
            category: category,
            plan: "Provide reminders for medication, use a pill organizer, and ensure adherence to the prescribed schedule."
          });
          break;
        case "Administering Medication":
          carePlan.push({
            category: category,
            plan: "Assist with administering medication as prescribed, monitor for side effects, and maintain accurate medication records."
          });
          break;
        case "Physical Therapy":
          carePlan.push({
            category: category,
            plan: "Provide support with physical therapy exercises (e.g., stretching, strength training) as recommended by the therapist, ensure a safe environment for exercises, and monitor progress with a physical therapist."
          });
          break;
        case "Occupational Therapy":
          carePlan.push({
            category: category,
            plan: "Provide support with occupational therapy activities (e.g., fine motor skills exercises), use adaptive equipment as needed, and monitor progress with an occupational therapist."
          });
          break;
        case "Speech Therapy":
          carePlan.push({
            category: category,
            plan: "Provide support with speech therapy exercises (e.g., articulation practice, language games) as recommended by the therapist, use communication aids, and monitor progress with a speech therapist."
          });
          break;
        case "Special Diet Requirements":
          carePlan.push({
            category: category,
            plan: "Ensure adherence to special diet requirements (e.g., gluten-free, low-sodium), plan meals accordingly, and monitor nutritional intake."
          });
          break;
        case "Tube Feeding":
          carePlan.push({
            category: category,
            plan: "Assist with tube feeding, ensure proper hygiene, and monitor for any complications such as infection or blockage."
          });
          break;
        case "Wound Care":
          carePlan.push({
            category: category,
            plan: "Provide support with wound care, ensure proper dressing changes, and monitor for any signs of infection or complications."
          });
          break;
        case "Mobility Support":
          carePlan.push({
            category: category,
            plan: "Provide support with mobility, use assistive devices as needed (e.g., walkers, wheelchairs), and ensure safety during movement and transfers."
          });
          break;
        case "Pain Management":
          carePlan.push({
            category: category,
            plan: "Provide support with pain management, use prescribed pain relief methods (e.g., medication, hot/cold therapy), and monitor for effectiveness and side effects."
          });
          break;
        case "Emotional and Spiritual Support":
          carePlan.push({
            category: category,
            plan: "Provide emotional and spiritual support, offer counseling or pastoral care, and encourage participation in spiritual activities if desired."
          });
          break;
        case "Newborn Care":
          carePlan.push({
            category: category,
            plan: "Provide support with newborn care (e.g., feeding, diaper changes), ensure adherence to safety guidelines, and monitor for any health concerns."
          });
          break;
        case "Breastfeeding Support":
          carePlan.push({
            category: category,
            plan: "Provide support with breastfeeding (e.g., positioning, latch techniques), ensure proper technique, and offer encouragement and resources for lactation support."
          });
          break;
        case "Postpartum Recovery Assistance":
          carePlan.push({
            category: category,
            plan: "Provide support with postpartum recovery (e.g., pain management, mobility assistance), ensure adherence to health guidelines, and monitor for any complications."
          });
          break;
        case "Emotional Support for New Mothers":
          carePlan.push({
            category: category,
            plan: "Provide emotional support for new mothers, encourage participation in support groups, and monitor for signs of postpartum depression."
          });
          break;
        case "Infant Care":
          carePlan.push({
            category: category,
            plan: "Provide support with infant care (e.g., feeding, diaper changes), ensure adherence to safety guidelines, and monitor for any health concerns."
          });
          break;
        case "Toddler Care":
          carePlan.push({
            category: category,
            plan: "Provide support with toddler care (e.g., feeding, potty training), ensure adherence to safety guidelines, and encourage developmental activities."
          });
          break;
        case "School-age Child Care":
          carePlan.push({
            category: category,
            plan: "Provide support with school-age child care (e.g., homework assistance, meal preparation), ensure adherence to safety guidelines, and encourage educational and recreational activities."
          });
          break;
        case "Homework Assistance":
          carePlan.push({
            category: category,
            plan: "Provide support with homework (e.g., creating a quiet study space, helping with assignments), ensure adherence to educational guidelines, and encourage a consistent study routine."
          });
          break;
        case "Activities and Playtime":
          carePlan.push({
            category: category,
            plan: "Provide support with activities and playtime (e.g., organized games, creative arts), ensure adherence to safety guidelines, and encourage social interaction and physical activity."
          });
          break;
        case "Meal Preparation for Children":
          carePlan.push({
            category: category,
            plan: "Provide support with meal preparation for children, ensure adherence to nutritional guidelines, and accommodate any dietary restrictions."
          });
          break;
        case "Bedtime Routine Assistance":
          carePlan.push({
            category: category,
            plan: "Provide support with bedtime routine (e.g., reading, calming activities), ensure adherence to safety guidelines, and create a calming environment for sleep."
          });
          break;
        case "Light Housekeeping":
          carePlan.push({
            category: category,
            plan: "Provide support with light housekeeping (e.g., cleaning, organizing), ensure adherence to safety guidelines, and maintain a clean and organized home environment."
          });
          break;
        case "Warming Food":
          carePlan.push({
            category: category,
            plan: "Provide support with warming food (e.g., using microwave or stove safely), ensure adherence to safety guidelines, and accommodate any dietary restrictions."
          });
          break;
        case "Social Interaction":
          carePlan.push({
            category: category,
            plan: "Provide support with social interaction (e.g., visiting friends, participating in group activities), encourage participation in social activities, and facilitate communication with family and friends."
          });
          break;
        case "Recreational Activities":
          carePlan.push({
            category: category,
            plan: "Provide support with recreational activities (e.g., hobbies, sports), encourage participation in enjoyable activities, and ensure adherence to safety guidelines."
          });
          break;
        case "Emotional Support":
          carePlan.push({
            category: category,
            plan: "Provide emotional support as needed (e.g., listening, counseling), offer counseling or support groups, and encourage participation in enjoyable activities."
          });
          break;
        default:
          carePlan.push({
            category: "General",
            plan: "Assess the patient's needs and provide appropriate care and support based on their specific requirements."
          });
          break;
      }
    });
  
    return carePlan;
  };
  