import React, { useEffect, useMemo, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import BreedCrump from '../../../components/ui/BreedCrump'
import Form from '../../../components/forms/Form'
import useSamples from '../../../hooks/samples/useSamples'
import { bioBankingService } from '../../../services/bioBanking/bioBankingService'
import useRefrigerators from '../../../hooks/refrigerators/useRefrigerators'
import useFreezers from '../../../hooks/freezers/useFreezers'
import useLaboratories from '../../../hooks/laboratories/useLaboratories'
import { laboratoryService } from '../../../services/laboratory/laboratoryService'


const AddBioBanking = () => {
    const { t } = useTranslation('global');
    const lang = useSelector(state => state.webLanguage);
    const navigate = useNavigate();
    const [samplesOptions, setSamplesOptions] = useState([]);
    const [refrigeratorsOptions, setRefrigeratorsOptions] = useState([]);
    const [freezersOptions, setFreezersOptions] = useState([]);

    const { fetchSamplesWithoutPagination } = useSamples();


    const [laboratoriesOptions, setLaboratoriesOptions] = useState([]);
    const { fetchLaboratoriesWithoutPagination } = useLaboratories();



    const [selectedLaboratoryId, setSelectedLaboratoryId] = useState(null);
    const [loadingRefrigeratorsAndFreezers, setLoadingRefrigeratorsAndFreezers] = useState(false);

    useEffect(() => {

        const loadLaboratories = async () => {
            try {
                const { data } = await fetchLaboratoriesWithoutPagination();
                setLaboratoriesOptions(data?.data?.map((laboratory) => ({ label: laboratory.name, value: laboratory.id })))

            } catch (error) {
                console.log(error)
            }
        }

        const loadSamples = async () => {
            try {
                const { data } = await fetchSamplesWithoutPagination();
                console.log(data?.data)
                setSamplesOptions(data?.data?.map(sample => ({ value: sample.id, label: sample.serial_full })) || [])
            } catch (error) {
                console.log(error)
            }
        }


        // const loadFreezers = async () => {
        //     try {
        //         const { data } = await fetchFreezersWithoutPagination();
        //         console.log(data?.data)
        //         setFreezersOptions(data?.data?.map(freezer => ({ value: freezer.id, label: freezer.name })) || [])
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }
        loadLaboratories()
        loadSamples();
        // loadRefrigerators();
        // loadFreezers();
    }, [fetchLaboratoriesWithoutPagination, fetchSamplesWithoutPagination]);


    const fetchLaboratoryById = async (id) => {
        try {
            setLoadingRefrigeratorsAndFreezers(true);

            const { data } = await laboratoryService.getLaboratoryByID(id);

            setRefrigeratorsOptions(data?.data?.refrigerators?.map(refrigerator => ({ value: refrigerator.id, label: refrigerator.name })) || [])
            setFreezersOptions(data?.data?.freezers?.map(refrigerator => ({ value: refrigerator.id, label: refrigerator.name })) || [])
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        } finally {
            setLoadingRefrigeratorsAndFreezers(false);
        }
    };

    useEffect(() => {
        if (selectedLaboratoryId) {
            fetchLaboratoryById(selectedLaboratoryId)
        }
        else {
            setFreezersOptions([]);
            setRefrigeratorsOptions([]);
        }
    }, [selectedLaboratoryId])

    /** Form Fields */
    const FIELDS = useMemo(() => [
        {
            name: 'tube_number',
            type: 'text',
            placeholder: t('bioBankingManagement.bioBankingFields.tubeNumberPlaceHolder'),
            label: t('bioBankingManagement.bioBankingFields.tubeNumber'),
            validation: {
                required: 'كود العينة مطلوب',
            }
        },
        {
            name: 'laboratory_id',
            type: 'single-select',
            placeholder: t('refrigeratorManagement.refrigeratorFields.laboratoryPlaceHolder'),
            label: t('refrigeratorManagement.refrigeratorFields.laboratory'),
            options: laboratoriesOptions,
            onChange: (value, setValue) => {
                // console.log(value);
                setSelectedLaboratoryId(value)
                setValue('refrigerator_id', '');
                setValue('freezer_id', '');
            }
        },
        {
            name: 'freezer_id',
            type: 'single-select',
            options: freezersOptions,
            placeholder: t('bioBankingManagement.bioBankingFields.freezerNumberPlaceHolder'),
            label: t('bioBankingManagement.bioBankingFields.freezerNumber'),
            validation: {
                required: 'رقم الفريرز مطلوب',
            },
            isDisabled: !selectedLaboratoryId || loadingRefrigeratorsAndFreezers

        },
        {
            name: 'refrigerator_id',
            type: 'single-select',
            options: refrigeratorsOptions,
            placeholder: t('bioBankingManagement.bioBankingFields.refrigeratorNumberPlaceHolder'),
            label: t('bioBankingManagement.bioBankingFields.refrigeratorNumber'),
            validation: {
                required: 'رقم الثلاجة مطلوب',
            },
            isDisabled: !selectedLaboratoryId || loadingRefrigeratorsAndFreezers
        },
        {
            name: 'sample_id',
            type: 'single-select',
            placeholder: t('bioBankingManagement.bioBankingFields.samplePlaceHolder'),
            label: t('bioBankingManagement.bioBankingFields.sample'),
            options: samplesOptions,
            validation: {
                required: 'العينة المراد حفظها مطلوبة',
            }
        },
        {
            name: 'temperature',
            type: 'text',
            placeholder: t('bioBankingManagement.bioBankingFields.temperaturePlaceHolder'),
            label: t('bioBankingManagement.bioBankingFields.temperature'),
            validation: {
                required: 'درجة حفظ العينة مطلوبة',
            }
        },
    ], [t, samplesOptions, laboratoriesOptions, refrigeratorsOptions, freezersOptions, selectedLaboratoryId, loadingRefrigeratorsAndFreezers]);

    /** Initial Values */
    const INITIAL_VALUES = useMemo(() => ({
        tube_number: '',
        laboratory_id: '',
        freezer_id: '',
        refrigerator_id: '',
        sample_id: '',
        temperature: '',
    }), []);

    /** Submit handler */
    const onSubmit = async (data) => {
        try {
            await bioBankingService.addBioBanking(data);
            toast.success(t('bioBankingManagement.addBioBankingSuccessStatus'));
            navigate(-1);
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-2 items-center">
                <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
                <BreedCrump breed_title={t('layouts.sideBar.bioBankingManagement')} />
            </div>

            <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
                <p className="text-2xl px-4 font-semibold text-black">
                    {t('bioBankingManagement.addBioBanking')}
                </p>

                <Form
                    fields={FIELDS}
                    gridLayout="grid-cols-2"
                    initial_values={INITIAL_VALUES}
                    submit_label={t('bioBankingManagement.addBioBanking')}
                    showCancelBtn={false}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}

export default AddBioBanking