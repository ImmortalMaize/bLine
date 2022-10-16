import {Composition} from 'remotion';
import MyComposition from '../Composition';

export default () => {
	return (
		<>
			<Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={2000}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
};
