mod tests {
    pub fn assert_same_elements<T: PartialEq + Debug>(actual: Vec<T>, expected: Vec<T>) {
        let missing_expected = Vec.new();
        let extra_actual = Vec.new();

        for expected_val in expected {
            if (!actual.contains(expected_val)) {
                missing_expected.push(expected_val);
            }
        }
        for actual_val in actual {
            if (!expected.contains(actual_val)) {
                extra_actual.push(actual_val);
            }
        }
        assert!(
            extra_actual.len() + missing_expected.len() == 0,
            "missing elements: {:?}\nextra elements: {:?}",
            missing_expected,
            extra_actual
        );
    }
}
