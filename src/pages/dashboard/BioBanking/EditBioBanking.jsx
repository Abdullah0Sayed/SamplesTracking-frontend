import React, { useEffect, useMemo, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import BreedCrump from '../../../components/ui/BreedCrump';
import { useTranslation } from 'react-i18next';
import Form from '../../../components/forms/Form';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import useSamples from '../../../hooks/samples/useSamples';
import useBioBanking from '../../../hooks/bioBanking/useBioBanking';
import useLaboratories from '../../../hooks/laboratories/useLaboratories';

import { bioBankingService } from '../../../services/bioBanking/bioBankingService';
import { laboratoryService } from '../../../services/laboratory/laboratoryService';

const EditBioBanking = () => {
    const { t } = useTranslation('global');
    const navigate = useNavigate();
    const { id } = useParams();

    const { fetchBioBanking } = useBioBanking();
    const { fetchSamplesWithoutPagination } = useSamples();
    const { fetchLaboratoriesWithoutPagination } = useLaboratories();

    const [objectRecord, setObjectRecord] = useState(null);

    const [samplesOptions, setSamplesOptions] = useState([]);
    const [laboratoriesOptions, setLaboratoriesOptions] = useState([]);
    const [refrigeratorsOptions, setRefrigeratorsOptions] = useState([]);
    const [freezersOptions, setFreezersOptions] = useState([]);

    const [selectedLaboratoryId, setSelectedLaboratoryId] = useState(null);
    const [loadingRefrigeratorsAndFreezers, setLoadingRefrigeratorsAndFreezers] = useState(false);

    /* ================= Load BioBanking Record ================= */
    useEffect(() => {
        if (!id) return;

        const loadObject = async () => {
            try {
                const { data } = await fetchBioBanking(id);
                setObjectRecord(data.data);
            } catch (error) {
                console.error(error);
                toast.error(t('global.errorProcessingRequest'));
            }
        };

        loadObject();
    }, [id]);

    /* ================= Load Samples & Labs ================= */
    useEffect(() => {
        const loadSamples = async () => {
            try {
                const { data } = await fetchSamplesWithoutPagination();
                setSamplesOptions(
                    data?.data?.map(sample => ({
                        value: sample.id,
                        label: sample.serial_full
                    })) || []
                );
            } catch (error) {
                console.error(error);
            }
        };

        const loadLaboratories = async () => {
            try {
                const { data } = await fetchLaboratoriesWithoutPagination();
                setLaboratoriesOptions(
                    data?.data?.map(lab => ({
                        value: lab.id,
                        label: lab.name
                    })) || []
                );
            } catch (error) {
                console.error(error);
            }
        };

        loadSamples();
        loadLaboratories();
    }, []);

    /* ================= Set lab on Edit ================= */
    useEffect(() => {
        if (objectRecord?.laboratory?.id) {
            setSelectedLaboratoryId(objectRecord.laboratory.id);
        }
    }, [objectRecord]);

    /* ================= Fetch Refrigerators & Freezers ================= */
    const fetchLaboratoryById = async (labId) => {
        try {
            setLoadingRefrigeratorsAndFreezers(true);

            const { data } = await laboratoryService.getLaboratoryByID(labId);

            setRefrigeratorsOptions(
                data?.data?.refrigerators?.map(item => ({
                    value: item.id,
                    label: item.name
                })) || []
            );

            setFreezersOptions(
                data?.data?.freezers?.map(item => ({
                    value: item.id,
                    label: item.name
                })) || []
            );
        } catch (error) {
            console.error(error);
            toast.error(t('global.errorProcessingRequest'));
        } finally {
            setLoadingRefrigeratorsAndFreezers(false);
        }
    };

    useEffect(() => {
        if (selectedLaboratoryId) {
            fetchLaboratoryById(selectedLaboratoryId);
        } else {
            setRefrigeratorsOptions([]);
            setFreezersOptions([]);
        }
    }, [selectedLaboratoryId]);

    /* ================= Form Fields ================= */
    const FIELDS = useMemo(() => [
        {
            name: 'tube_number',
            type: 'text',
            label: t('bioBankingManagement.bioBankingFields.tubeNumber'),
            placeholder: t('bioBankingManagement.bioBankingFields.tubeNumberPlaceHolder'),
            validation: { required: 'كود العينة مطلوب' }
        },
        {
            name: 'laboratory_id',
            type: 'single-select',
            label: t('refrigeratorManagement.refrigeratorFields.laboratory'),
            placeholder: t('refrigeratorManagement.refrigeratorFields.laboratoryPlaceHolder'),
            options: laboratoriesOptions,
            onChange: (value, setValue) => {
                setSelectedLaboratoryId(value);
                setValue('freezer_id', '');
                setValue('refrigerator_id', '');
            }
        },
        {
            name: 'freezer_id',
            type: 'single-select',
            label: t('bioBankingManagement.bioBankingFields.freezerNumber'),
            placeholder: t('bioBankingManagement.bioBankingFields.freezerNumberPlaceHolder'),
            options: freezersOptions,
            isDisabled: !selectedLaboratoryId || loadingRefrigeratorsAndFreezers,
            validation: { required: 'رقم الفريزر مطلوب' }
        },
        {
            name: 'refrigerator_id',
            type: 'single-select',
            label: t('bioBankingManagement.bioBankingFields.refrigeratorNumber'),
            placeholder: t('bioBankingManagement.bioBankingFields.refrigeratorNumberPlaceHolder'),
            options: refrigeratorsOptions,
            isDisabled: !selectedLaboratoryId || loadingRefrigeratorsAndFreezers,
            validation: { required: 'رقم الثلاجة مطلوب' }
        },
        {
            name: 'sample_id',
            type: 'single-select',
            label: t('bioBankingManagement.bioBankingFields.sample'),
            placeholder: t('bioBankingManagement.bioBankingFields.samplePlaceHolder'),
            options: samplesOptions,
            validation: { required: 'العينة مطلوبة' }
        },
        {
            name: 'temperature',
            type: 'text',
            label: t('bioBankingManagement.bioBankingFields.temperature'),
            placeholder: t('bioBankingManagement.bioBankingFields.temperaturePlaceHolder'),
            validation: { required: 'درجة الحرارة مطلوبة' }
        }
    ], [
        t,
        laboratoriesOptions,
        samplesOptions,
        freezersOptions,
        refrigeratorsOptions,
        selectedLaboratoryId,
        loadingRefrigeratorsAndFreezers
    ]);

    /* ================= Initial Values ================= */
    const INITIAL_VALUES = useMemo(() => ({
        tube_number: objectRecord?.tube_number || '',
        laboratory_id: objectRecord?.laboratory?.id || '',
        freezer_id: objectRecord?.freezer_id?.id || '',
        refrigerator_id: objectRecord?.refrigerator_id?.id || '',
        sample_id: objectRecord?.sample?.id || '',
        temperature: objectRecord?.temperature || '',
    }), [objectRecord]);

    /* ================= Submit ================= */
    const onSubmit = async (data) => {
        try {
            await bioBankingService.updateBioBanking({
                id: objectRecord.id,
                ...data
            });
            toast.success(t('global.successUpdateProcessingRequest'));
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <FaArrowRight className="cursor-pointer" onClick={() => navigate(-1)} />
                <BreedCrump breed_title={t('layouts.sideBar.samples')} />
            </div>

            <div className="bg-white shadow-md rounded-2xl py-4">
                <p className="text-2xl font-semibold px-4">
                    {t('samplesManagement.editSample')}
                </p>

                <Form
                    fields={FIELDS}
                    initial_values={INITIAL_VALUES}
                    gridLayout="grid-cols-2"
                    submit_label={t('global.save')}
                    showCancelBtn
                    onSubmit={onSubmit}
                    onCancel={() => navigate(-1)}
                    enableReinitialize
                />
            </div>
        </div>
    );
};

export default EditBioBanking;
