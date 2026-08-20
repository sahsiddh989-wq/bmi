const state = { unit: 'metric' };

const $ = (id) => document.getElementById(id);
const buttons = document.querySelectorAll('.unit-btn');

buttons.forEach((button) => button.addEventListener('click', () => {
  state.unit = button.dataset.unit;
  buttons.forEach((b) => b.classList.toggle('active', b === button));
  $('height-label').querySelector('span').textContent = state.unit === 'metric' ? 'cm' : 'in';
  $('weight-label').querySelector('span').textContent = state.unit === 'metric' ? 'kg' : 'lb';
  $('height').placeholder = state.unit === 'metric' ? '175' : '69';
  $('weight').placeholder = state.unit === 'metric' ? '70' : '154';
}));

function calculate() {
  const age = Number($('age').value);
  const rawHeight = Number($('height').value);
  const rawWeight = Number($('weight').value);
  const sex = $('sex').value;
  const activity = Number($('activity').value);

  if (!age || !rawHeight || !rawWeight || age < 2 || rawHeight <= 0 || rawWeight <= 0) {
    $('bmi-message').textContent = 'Please enter a valid age, height and weight.';
    return;
  }

  const heightCm = state.unit === 'metric' ? rawHeight : rawHeight * 2.54;
  const weightKg = state.unit === 'metric' ? rawWeight : rawWeight * 0.45359237;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category, message;
  if (bmi < 18.5) {
    category = 'Underweight'; message = 'Your BMI is below the standard adult healthy range.';
  } else if (bmi < 25) {
    category = 'Healthy range'; message = 'Your BMI falls within the standard adult healthy range.';
  } else if (bmi < 30) {
    category = 'Overweight'; message = 'Your BMI is above the standard adult healthy range.';
  } else {
    category = 'Obesity range'; message = 'Your BMI is in the obesity range; consider discussing your health with a professional.';
  }

  const healthyMin = 18.5 * heightM * heightM;
  const healthyMax = 24.9 * heightM * heightM;
  const bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const calories = bmr * activity;

  $('bmi-value').textContent = bmi.toFixed(1);
  $('bmi-category').textContent = category;
  $('bmi-message').textContent = message;
  $('healthy-weight').textContent = state.unit === 'metric'
    ? `${healthyMin.toFixed(1)}–${healthyMax.toFixed(1)} kg`
    : `${(healthyMin * 2.20462).toFixed(0)}–${(healthyMax * 2.20462).toFixed(0)} lb`;
  $('bmr').textContent = `${Math.round(bmr).toLocaleString()} kcal`;
  $('calories').textContent = `${Math.round(calories).toLocaleString()} kcal`;

  // Position the marker across a 12–40 BMI display range.
  const marker = Math.max(0, Math.min(100, ((bmi - 12) / 28) * 100));
  $('range-marker').style.left = `${marker}%`;

  const ringEnd = Math.max(5, Math.min(95, marker));
  document.querySelector('.score-ring').style.background = `conic-gradient(var(--accent) 0 ${ringEnd}%, #e9eff3 ${ringEnd}% 100%)`;
  $('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

$('calculate').addEventListener('click', calculate);
['age', 'height', 'weight'].forEach((id) => $(id).addEventListener('keydown', (e) => {
  if (e.key === 'Enter') calculate();
}));
