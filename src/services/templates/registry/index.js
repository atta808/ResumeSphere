import TemplateRegistry from '../TemplateRegistry';
import ClassicATS from './ClassicATS';
import ModernProfessional from './ModernProfessional';
import Executive from './Executive';
import Minimal from './Minimal';
import Creative from './Creative';
import Academic from './Academic';
import Corporate from './Corporate';
import International from './International';

// Initialize templates
TemplateRegistry.register(ClassicATS);
TemplateRegistry.register(ModernProfessional);
TemplateRegistry.register(Executive);
TemplateRegistry.register(Minimal);
TemplateRegistry.register(Creative);
TemplateRegistry.register(Academic);
TemplateRegistry.register(Corporate);
TemplateRegistry.register(International);

export default TemplateRegistry;
