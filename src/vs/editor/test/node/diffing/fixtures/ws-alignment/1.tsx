import { Stack, Text } from '@fluentui/react';
import { View } from '../../layout/layout';

export const WelcomeView = () => {
	return (
		<View title='HiTechAi Studio Code Tools'>
			<Stack grow={true} verticalFill={true}>
				<Stack.Item>
					<Text>
						Welcome to the HiTechAi Studio Code Tools application.
					</Text>
				</Stack.Item>
			</Stack>
		</View>
	);
}
